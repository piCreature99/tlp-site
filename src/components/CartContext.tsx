import { createContext, useContext, useState, type ReactNode } from 'react';

// Define the structure of a Product
export interface Product {
  id: number;
  name: string;
  price: string;
  rating: number;
  image: string;
  discount:  string;
}

// Define the shape of our Context State
interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
}

// Initialize with undefined, but tell TS it will eventually be CartContextType
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    // We use the spread operator to keep the array immutable
    setCart((prev) => [...prev, product]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook with a "Safety Check"
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};