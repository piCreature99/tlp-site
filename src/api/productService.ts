// services/productService.ts
export async function getProducts(db: D1Database, params: {
  categorySlug: string | null,
  brandSlugs: string | null,
  tagSlugs: string | null,
  limit: number,
  page: number,
  bulkCategories?: boolean // New flag for scaling strategy
}) {
  const { categorySlug, page, limit, tagSlugs, brandSlugs, bulkCategories } = params;
  
  // ==========================================
  // MODE 1: BULK FETCH FOR ALL CATEGORIES
  // ==========================================
  if (bulkCategories) {
    // We use a CTE and ROW_NUMBER() to grab up to N items per category dynamically
    const bulkQuery = `
      WITH RankedProducts AS (
        SELECT p.*, c.name as category_name, b.name as brand_name,
        (SELECT GROUP_CONCAT(t.name) FROM tags t 
         JOIN product_tags pt ON t.id = pt.tag_id 
         WHERE pt.product_id = p.id) as tags,
        ROW_NUMBER() OVER (PARTITION BY p.category_id ORDER BY p.id DESC) as rn
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN brands b ON p.brand_id = b.id
      )
      SELECT * FROM RankedProducts WHERE rn <= ?
    `;

    // Bind the limit parameter (e.g., 48) to determine the partition cap
    const bulkProducts = await db.prepare(bulkQuery).bind(limit).all();

    return {
      products: bulkProducts.results,
      totalItems: bulkProducts.results.length,
      totalPages: 1
    };
  }

  // ==========================================
  // MODE 2: STANDARD SINGLE CATEGORY / FILTERED FETCH
  // ==========================================
  const offset = (page - 1) * limit;

  // 1. Build the dynamic WHERE clause
  let whereClause = "WHERE 1=1";
  const queryParams: any[] = [];

  if (categorySlug) {
    whereClause += " AND c.slug = ?";
    queryParams.push(categorySlug);
  }

  if (tagSlugs) {
    const slugArray = tagSlugs.split(',');
    const placeholders = slugArray.map(() => '?').join(',');
    whereClause += ` AND p.id IN (
      SELECT pt.product_id FROM product_tags pt 
      JOIN tags t ON pt.tag_id = t.id 
      WHERE t.slug IN (${placeholders})
    )`;
    queryParams.push(...slugArray);
  }

  if (brandSlugs) {
    const slugArray = brandSlugs.split(',');
    const placeholders = slugArray.map(() => '?').join(',');
    whereClause += `  AND b.slug IN (${placeholders})`;
    queryParams.push(...slugArray);
  }

  // 2. Fetch Products
  const query = `
    SELECT p.*, c.name as category_name, b.name as brand_name,
    (SELECT GROUP_CONCAT(t.name) FROM tags t 
     JOIN product_tags pt ON t.id = pt.tag_id 
     WHERE pt.product_id = p.id) as tags
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN brands b ON p.brand_id = b.id
    ${whereClause}
    LIMIT ? OFFSET ?
  `;

  const productsPromise = db.prepare(query).bind(...queryParams, limit, offset).all();

  // 3. Fetch Count
  const countQuery = `
    SELECT COUNT(*) as total 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id 
    LEFT JOIN brands b ON p.brand_id = b.id 
    ${whereClause}
  `;
  const countPromise = db.prepare(countQuery).bind(...queryParams).first<{ total: number }>();

  const [products, countResult] = await Promise.all([productsPromise, countPromise]);

  return {
    products: products.results,
    totalItems: countResult?.total ?? 0,
    totalPages: Math.ceil((countResult?.total ?? 0) / limit) || 1
  };
}


// const CACHE_TIMEOUT_MS = 10000; // 10 seconds timeout

/**
 * Scalable Catalog Fetcher: Fetches up to 48 items per category 
 * and inserts them straight into IndexedDB automatically.
 * * @param availableCategoryIds Array of valid category IDs used to initialize tracking
 */
// export const syncBulkCatalog = async (availableCategoryIds: number[]): Promise<void> => {
//   const currentTime = Date.now();

//   // 1. Check if the local cache is still valid (sample check on the first category)
//   // The internal cacheMeta has its own timestamp
//   const sampleMeta = await indexedDB.cacheMeta.get(availableCategoryIds[0] || 0);
//   const isCacheValid = sampleMeta && (currentTime - sampleMeta.last_fetched < CACHE_TIMEOUT_MS);

//   if (isCacheValid) {
//     console.log("⚡ [Cache Hit] Browser IndexedDB is fresh. Skipping network request.");
//     return;
//   }

//   console.log("🌐 [Cache Expired] Fetching 48 items per category from Cloudflare Worker...");
//   try {
//     // 2. Hit your backend endpoint with the bulk flag enabled
//     const response = await fetch('/api/products?bulk=true');
//     if (!response.ok) throw new Error('Failed to fetch global catalog data');
    
//     const data: any = await response.json();
    
//     // Handle either a flat array or a nested wrapper object safely from the stream
//     const allProducts: Product[] = Array.isArray(data) ? data : data.products;

//     // 3. Open a write transaction directly inside IndexedDB
//     await indexedDB.transaction('rw', [indexedDB.products, indexedDB.cacheMeta], async () => { // rw (read write) -> access permission
      
//       // Step A: Extract all unique category IDs present in the incoming backend payload
//       const incomingCategoryIds = [
//         ...new Set(allProducts.map(p => p.category_id).filter((id): id is number => id !== null))
//       ];// id is number tell it to expect number only, so when you pass this around, it's just number

//       // Step B: Clear out old cached items for ONLY the incoming categories
//       await indexedDB.products.where('category_id').anyOf(incomingCategoryIds).delete();

//       // Step C: Straight insertion of all products into the local browser storage
//       await indexedDB.products.bulkPut(allProducts);

//       // Step D: Bulk create timestamp records to reset the 10-second lifecycle clock
//       const metaEntries = incomingCategoryIds.map(catId => ({
//         category_id: catId,
//         last_fetched: currentTime
//       }));
//       await indexedDB.cacheMeta.bulkPut(metaEntries);
//     });

//     console.log(`✅ Straight insertion successful! Synchronized ${allProducts.length} items across all categories inside IndexedDB.`);

//   } catch (error) {
//     console.error("🚨 Bulk synchronization failed. Operating in offline fallback mode:", error);
//   }
// };

// /**
//  * Fetches 48 items for a specific category from the Worker API 
//  * and stores them inside IndexedDB using Dexie.
//  * * @param categorySlug The string identifier (e.g., 'electronics')
//  * @param categoryId The numerical ID used for local database indexing
//  */
// export const fetchAndCacheCategory = async (categorySlug: string, categoryId: number): Promise<Product[]> => {
//   const currentTime = Date.now();

//   // 1. Check our local Dexie metadata table for a timestamp
//   const meta = await indexedDB.cacheMeta.get(categoryId);
//   const isCacheValid = meta && (currentTime - meta.last_fetched < CACHE_TIMEOUT_MS);

//   if (isCacheValid) {
//     console.log(`⚡ [Cache Hit] Reading category "${categorySlug}" from local IndexedDB.`);
//     return await indexedDB.products.where('category_id').equals(categoryId).toArray();
//   }

//   console.log(`🌐 [Cache Expired/Missing] Fetching 48 items from Cloudflare Worker API...`);
//   try {
//     // 2. Call your endpoint requesting a batch chunk of 48 items
//     const response = await fetch(`/api/products?category=${categorySlug}&limit=48&page=1`);
    
//     if (!response.ok) throw new Error('Network response was not ok');
    
//     // Assuming productsData returns an array of products or an object containing it
//     const productsData: any = await response.json();
//     const freshProducts: Product[] = Array.isArray(productsData) ? productsData : productsData.products;

//     // 3. Use a transactional write to safely update our local tables
//     await indexedDB.transaction('rw', [indexedDB.products, indexedDB.cacheMeta], async () => {
//       // Clear out old cached entries for THIS category only so they don't pile up staly
//       await indexedDB.products.where('category_id').equals(categoryId).delete();

//       // Bulk insert the fresh 48 items into IndexedDB
//       await indexedDB.products.bulkPut(freshProducts);

//       // Save/Update the timestamp record for this category block
//       await indexedDB.cacheMeta.put({
//         category_id: categoryId,
//         last_fetched: currentTime
//       });
//     });

//     return freshProducts;
//   } catch (error) {
//     console.error(`🚨 Failed to fetch online for category "${categorySlug}". Falling back to local data:`, error);
//     // Graceful Degradation: If offline or Cloudflare times out, read local database entries
//     return await indexedDB.products.where('category_id').equals(categoryId).toArray();
//   }
// };