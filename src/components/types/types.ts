export interface BannerItem {
  id: number;
  category: string;
  image: string;
  color?: string; // Optional: maybe a "Shop Now" text?
}

export interface MockProducts {
  id: number;
  name: string;
  price: string;
  rating: number;
  image: string;
  discount: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  image_url: string;
  discount_label: string;
  category: string;
  stock_count: number;
  description: string;
  created_at: string;
  tags: string;
}

export interface ProductAndPage {
  products: Product[];
  totalPages: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  color_code: string;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
}