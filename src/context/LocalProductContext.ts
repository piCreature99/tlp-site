// src/context/LocalProductContext.ts
import { createContext, useContext } from 'react';
import type { Category, JoinedProduct } from '../api/indexedDB';

export interface ProductContextType {
  products: JoinedProduct[];
  selectedProduct: JoinedProduct | null;
  getProductById: (idAndSlug: string) => Promise<JoinedProduct | null>
  totalPages: number;
  loading: boolean;
  categories: Category[];
  selectedBrands: Set<string>;
  selectedBrandsHandler: (value: string) => void;
  selectedTags: Set<string>;
  selectedTagsHandler: (value: string) => void;
  activePage: number;
  setActivePage: (page: number) => void;
  selectedCategory: string | null;
  setSelectedCategory: (slug: string | null) => void;
  productCount: number;
  syncDatabase: (force?: boolean) => Promise<void>;
}

// Export the raw context
export const LocalProductContext = createContext<ProductContextType | undefined>(undefined);

// Export your consumer hook right alongside it
export const useLocalProducts = () => {
  const context = useContext(LocalProductContext);
  if (!context) throw new Error("useLocalProducts must be used within LocalProductProvider");
  return context;
};