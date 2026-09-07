import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import Dexie, { type Table } from 'dexie';
// 1. Import your executable runtime values first
import { localDb } from '../api/indexedDB';
// 2. Import your structural TypeScript interfaces clearly marked as types
import type { Brand, CartItems, Category, JoinedProduct, Product, ProductTag, Tag } from '../api/indexedDB';
import { LocalProductContext } from '../context/LocalProductContext';

export function LocalProductProvider({ children }: { children: React.ReactNode }) {
  const CACHE_TIMEOUT_MS = 10000;
  const CACHE_KEY = 'last_product_sync_timestamp';
  const ITEMS_PER_PAGE = 12; // Standard catalog page layout sizing
  // --- Core Cache States ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // --- Interactive Filtering Controls ---
  const [selectedProduct, setSelectedProduct] = useState<JoinedProduct | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [activePage, setActivePage] = useState<number>(1);
  const [productCount, setProductCount] = useState<number>(48); // limit parameter matching your target layout

  // --- Processed View Products Data Output ---
  const [viewProducts, setViewProducts] = useState<JoinedProduct[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);

  // --- Get Categories and set default --- (redundant db read because processCatalogView already takes care of this)

  // useEffect(() => {
  //   const getLocalCategories = async () => {
  //     try {
  //       // 1. Read directly from your local Dexie instance instead of a network fetch
  //       const catList: Category[] = await localDb.categories.toArray();

  //       // 2. Set the state for your UI sidebar or top navigation bar
  //       setCategories(catList);

  //       // 3. Fallback: Automatically highlight/select the first category slug if none is active
  //       if (catList.length > 0 && !selectedCategory) {
  //         setSelectedCategory(catList[0].slug);
  //       }
  //     } catch (err) {
  //       console.error("Failed to read categories from local storage:", err);
  //     }
  //   };

  //   getLocalCategories();
  // }, [selectedCategory, setSelectedCategory, setCategories]);

  // --- State Toggle Handlers ---
  const selectedBrandsHandler = useCallback((slug: string) => {
    setSelectedBrands(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
    setActivePage(1); // Reset pagination back to page 1 on layout filter changes
  }, []);

  const selectedTagsHandler = useCallback((slug: string) => {
    setSelectedTags(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
    setActivePage(1);
  }, []);

  /**
 * High-performance relational point-lookup for a single product page view.
 * Bypasses pagination cuts, filters, and row-capping bugs entirely.
 */
  const getProductById = useCallback(async (idAndSlug: string): Promise<JoinedProduct | null> => {
    if (!idAndSlug) return null;

    // 1. Isolate the alphanumeric ID by splitting at the double hyphen delimiter
  // ("prod_8jF2k9s--premium-leather-wallet" -> "prod_8jF2k9s")
  const productId = parseInt(idAndSlug.split('--')[0], 10);
  if (!productId) return null;

    // 2. High-speed primary key lookup (Direct O(1) memory mapping in IndexedDB)
    const product = await localDb.products.get(productId);
    if (!product) return null;

    // 3. Fetch only the relations required for this specific item in parallel
    const [catRecord, brandRecord, productTagsRecords] = await Promise.all([
      localDb.categories.get(product.category_id),
      localDb.brands.get(product.brand_id),
      localDb.product_tags.where('product_id').equals(product.id).toArray()
    ]);

    // 4. Resolve string tags if pivot matches exist
    let associatedTagNames: string[] = [];
    if (productTagsRecords.length > 0) {
      const tagIds = productTagsRecords.map(pt => pt.tag_id);
      // Pluck all matching tags directly out of the primary key table
      const tagsRecords = await localDb.tags.where('id').anyOf(tagIds).toArray();
      associatedTagNames = tagsRecords.map(t => t.name);
    }

    const joinedProduct = {
      ...product,
      category_name: catRecord ? catRecord.name : null,
      category_slug: catRecord ? catRecord.slug : null,
      brand_name: brandRecord ? brandRecord.name : null,
      brand_slug: brandRecord ? brandRecord.slug : null,
      tags: associatedTagNames.length > 0 ? associatedTagNames : null
    };

    // 5. Return the complete, unified relational schema shape
    setSelectedProduct(joinedProduct);
    return joinedProduct
  }, []);

  /**
   * Reads state configurations and processes filtering, sorting, joins,
   * and pagination entirely in client-side memory using the loaded tables.
   */
  const processCatalogView = useCallback(async () => { // Recreating this function cause the child to re-render, useCallback solves this with dependencies
    // 1. Resolve tables into raw relational tracking structures
    const [allCategories, allBrands, allTags, allProductTags, allProducts] = await Promise.all([
      localDb.categories.toArray(),
      localDb.brands.toArray(),
      localDb.tags.toArray(),
      localDb.product_tags.toArray(),
      localDb.products.orderBy('id').reverse().toArray() // Match sorting criteria ORDER BY p.id DESC
    ]);

    // console.log(allCategories);

    // Keep active sidebar filter data synced up with state updates
    setCategories(allCategories);

    // Select default cat
    if (allCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(allCategories[0].slug);
    }

    // 2. Map-level dictionary indexing
    const categoryIdMap = new Map(allCategories.map(c => [c.id, c]));
    const categorySlugMap = new Map(allCategories.map(c => [c.slug, c.id]));
    const brandIdMap = new Map(allBrands.map(b => [b.id, b]));
    const brandSlugMap = new Map(allBrands.map(b => [b.slug, b.id]));
    const tagIdMap = new Map(allTags.map(t => [t.id, t]));
    const tagSlugMap = new Map(allTags.map(t => [t.slug, t.id]));

    // Group tag IDs by product_id
    const productToTagsMap = new Map<number, number[]>();
    allProductTags.forEach(pt => {
      if (!productToTagsMap.has(pt.product_id)) {
        productToTagsMap.set(pt.product_id, []);
      }
      productToTagsMap.get(pt.product_id)!.push(pt.tag_id);
    });

    // 3. Apply the SQL ROW_NUMBER() OVER (PARTITION BY category_id) limits on raw products
    const categoryCountsTable = new Map<number, number>();
    const sectionCappedProducts: Product[] = [];

    for (const p of allProducts) {
      // first get the id of product, if none found, return 0 for count then in the if block assign that id and begin counting for each same category id found
      const currentCount = categoryCountsTable.get(p.category_id) || 0;
      if (currentCount < productCount) {
        sectionCappedProducts.push(p);
        categoryCountsTable.set(p.category_id, currentCount + 1);
      }
    }

    // 4. Mimic Left Joins and resolve rich attribute fields
    const fullyJoinedProducts: JoinedProduct[] = sectionCappedProducts.map(p => {
      const associatedTagIds = productToTagsMap.get(p.id) || []; // the the array of tag ids associated with the p.id
      const associatedTagNames = associatedTagIds // lop through this array to get the name
        .map(id => tagIdMap.get(id)?.name)
        .filter(Boolean) as string[]; // clean the array of empty values?

      const catRecord = categoryIdMap.get(p.category_id); // get category
      const brandRecord = brandIdMap.get(p.brand_id); // get brand

      return {
        ...p,
        category_name: catRecord ? catRecord.name : null,
        category_slug: catRecord ? catRecord.slug : null,
        brand_name: brandRecord ? brandRecord.name : null,
        brand_slug: brandRecord ? brandRecord.slug : null,
        tags: associatedTagNames.length > 0 ? associatedTagNames : null // Kept as native clean loopable arrays!
      };
    });

    // 5. Apply User UI Filter State Controls (Category, Brands, Tags)
    let filteredResults = fullyJoinedProducts;

    // Filter by Active Category Selection
    if (selectedCategory) {
      filteredResults = filteredResults.filter(p => p.category_slug === selectedCategory);
    }

    // Filter by Active Brand Selection Sets
    if (selectedBrands.size > 0) {
      filteredResults = filteredResults.filter(p => p.brand_slug && selectedBrands.has(p.brand_slug));
    }

    // Filter by Active Tag Selection Sets
    if (selectedTags.size > 0) {
      filteredResults = filteredResults.filter(p => {
        if (!p.tags) return false;
        // Check if product contains any of the selected filter tag names
        return p.tags.some(tagName => {
          const matchedTag = allTags.find(t => t.name === tagName); // either tag is fine
          return matchedTag && selectedTags.has(matchedTag.slug);
        });
      });
    }

    // 6. Handle Client-Side Pagination Cuts
    const totalCount = filteredResults.length;
    const computedTotalPages = Math.ceil(totalCount / ITEMS_PER_PAGE) || 1;
    setTotalPages(computedTotalPages);

    const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
    const paginatedSlice = filteredResults.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    setViewProducts(paginatedSlice);
  }, [selectedCategory, selectedBrands, selectedTags, activePage, productCount]);

  /**
   * Handles cloud synchronization and calls view engine compilation post-update
   */
  const syncDatabase = useCallback(async (force = false) => {
    setLoading(true);
    try {
      const lastSync = localStorage.getItem(CACHE_KEY);
      const now = Date.now();

      if (!force && lastSync && now - parseInt(lastSync, 10) < CACHE_TIMEOUT_MS) { // praseInt convert date string into number, parameter 10 is radix (base 10)
        console.log("⚡ Cache is fresh. Reprocessing existing tables locally.");
        await processCatalogView();
        return;
      }

      console.log("🌐 Cache stale. Querying payload data from Cloudflare Worker endpoint...");
      const response = await fetch('/api/sync-catalog');
      if (!response.ok) throw new Error('Database sync network request failed');

      const payload: {
        categories: Category[];
        brands: Brand[];
        tags: Tag[];
        products: Product[];
        product_tags: ProductTag[];
        cart_items: CartItems[];
      } = await response.json();

      // console.log("RESPONSE:");
      // console.log(payload);
      
      await localDb.transaction('rw', [localDb.categories, localDb.brands, localDb.tags, localDb.products, localDb.product_tags, localDb.cart_items], async () => {
        await localDb.categories.clear();
        await localDb.brands.clear();
        await localDb.tags.clear();
        await localDb.products.clear();
        await localDb.product_tags.clear();
        await localDb.cart_items.clear();
        // console.log("Hello");
        
        await localDb.categories.bulkPut(payload.categories || []);
        await localDb.brands.bulkPut(payload.brands || []);
        await localDb.tags.bulkPut(payload.tags || []);
        await localDb.products.bulkPut(payload.products || []);
        await localDb.product_tags.bulkPut(payload.product_tags || []);
        await localDb.cart_items.bulkPut(payload.cart_items || []);
      });
      localStorage.setItem(CACHE_KEY, Date.now().toString());
      await processCatalogView();
    } catch (error) {
      console.error("Failed syncing catalog database:", error);
      await processCatalogView(); // Gracefully fallback to what's inside local IndexedDB
    } finally {
      setLoading(false);
    }
  }, [processCatalogView]);

  // Re-run filter engine queries immediately whenever user filter metrics change
  useEffect(() => {
    processCatalogView();
  }, [processCatalogView]); // the function is a useCallback, basically if the trigger is not one of its dependency, the function won't return a new pointer and cause a re-render.

  // Bootstrap initial invocation trigger
  useEffect(() => {
    syncDatabase();
  }, [syncDatabase]);

  return (
    <LocalProductContext.Provider
    value={{
      products: viewProducts,
      selectedProduct,
      getProductById,
      totalPages,
        loading,
        categories,
        selectedBrands,
        selectedBrandsHandler,
        selectedTags,
        selectedTagsHandler,
        activePage,
        setActivePage,
        selectedCategory,
        setSelectedCategory,
        productCount,
        syncDatabase, 
      }}
    >
      {children}
    </LocalProductContext.Provider>
  );
};