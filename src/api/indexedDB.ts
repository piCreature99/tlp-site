import Dexie, { type Table } from 'dexie';

// --- Type Definitions ---
export interface Category { id: number; name: string; slug: string; }
export interface Brand { id: number; name: string; slug: string; }
export interface Tag { id: number; name: string; slug: string; color_code: string; }
export interface ProductTag { product_id: number; tag_id: number; }
export interface CartItems {
  user_id: number;
  product_id: number;
  quantity: number;
  updated_at: string;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  image_url: string;
  discount_label: string;
  stock_count: number;
  description: string;
  category_id: number;
  brand_id: number;
  created_at: string;
}

export interface JoinedProduct extends Product {
  category_name: string | null;
  category_slug: string | null;
  brand_name: string | null;
  brand_slug: string | null;
  tags: string[] | null; // Fixed from string to string[] for optimal React rendering!
}

// --- Dexie Database Setup ---
export class ProductDatabase extends Dexie {
  categories!: Table<Category, number>;
  brands!: Table<Brand, number>;
  tags!: Table<Tag, number>;
  products!: Table<Product, number>;
  product_tags!: Table<ProductTag, [number, number]>;
  cart_items!: Table<CartItems, [number, number]>;

  constructor() {
    super('ProductCatalogDB');
    this.version(1).stores({
      categories: '++id, &name, &slug',
      brands: '++id, &name, &slug',
      tags: '++id, &name, &slug',
      products: '++id, &name, category_id, brand_id',
      product_tags: '[product_id+tag_id], product_id, tag_id',
      cart_items: '[user_id+product_id], user_id, product_id'
    });
  }
}

export const localDb = new ProductDatabase();