import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Category, Product, ProductAndPage } from './types/types';

interface ProductContextType {
  products: Product[];
  totalPages: number;
  loading: boolean;
  categories: Category[];
  // Controls
  selectedBrands: Set<string>;
  selectedBrandsHandler: (value: string) => void;
  selectedTags: Set<string>;
  selectedTagsHandler: (value: string) => void;
  activePage: number;
  setActivePage: (page: number) => void;
  selectedCategory: string | null;
  setSelectedCategory: (slug: string | null) => void;
  productCount: number; // The limit
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // State for filters
  const [activePage, setActivePage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  // const [productCount, setProductCount] = useState(12);
  const productCount = 12;

  const toggleFilter = (slug: string, setSelected: React.Dispatch<React.SetStateAction<Set<string>>>) => {
    setSelected((prevSet) => {
      const newSet = new Set(prevSet);
      if (newSet.has(slug)) {
        newSet.delete(slug); // Unpick
      } else {
        newSet.add(slug);    // Pick
      }
      return newSet;
    });
  };

  const selectedBrandsHandler = (slug: string) => {
    toggleFilter(slug, setSelectedBrands);
    // console.log(selectedBrands);
  }

  const selectedTagsHandler = (slug: string) => {
    toggleFilter(slug, setSelectedTags);
  }

  // Reset pagination when any filter changes
  useEffect(() => {
    setActivePage(1);
  }, [selectedCategory, selectedBrands, selectedTags]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await fetch('/api/categories'); // The browser glue this with your site address together
        const catList: Category[] = await response.json();
        // Set your categories state for the UI bar
        setCategories(catList);

        // Set the default! This triggers the second useEffect
        if (catList.length > 0 && !selectedCategory) {
          setSelectedCategory(catList[0].slug);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    getCategories();
  }, []); // Runs once on load

  useEffect(() => {

    if (categories.length === 0) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = {
          limit: productCount.toString(),
          page: activePage.toString(),
        };

        // Only add filters if they aren't null
        if (selectedCategory) params.category = selectedCategory; // you're providing a key by calling category and assign value to this key. 
        if (selectedBrands.size > 0) {
          params.brands = Array.from(selectedBrands).join(',');
        }
        if (selectedTags.size > 0) {
          params.tags = Array.from(selectedTags).join(',');
        }

        const query = new URLSearchParams(params);
        const res = await fetch(`/api/products?${query.toString()}`);

        const data: ProductAndPage = await res.json();
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedCategory, selectedBrands, selectedTags, activePage, productCount, categories]);

  return (
    <ProductContext.Provider value={{
      products, totalPages, loading, categories,
      activePage, setActivePage,
      selectedCategory, setSelectedCategory,
      selectedBrands, selectedBrandsHandler, // Add these
      selectedTags, selectedTagsHandler,     // Add these
      productCount
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProducts must be used within ProductProvider");
  return context;
};