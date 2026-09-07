import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { type Product } from './types/types'
import { localDb, type JoinedProduct } from '../api/indexedDB';
import { fetchLocalCartForUser } from '../api/helper';

// Define the shape of our Context State
interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  addToCart: (product: JoinedProduct) => void;
}

export interface CartItem extends JoinedProduct {
  quantity: number;
}

// Initialize with undefined, but tell TS it will eventually be CartContextType
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    // 4. Map the database table schema to your active React state array structure
    (async () => {
    try{
      let uiFormattedCart = [];
      let currentUserId;
      const response = await fetchLocalCartForUser();
      if('userCartRows' in response){

        uiFormattedCart = response.userCartRows.map((item) => ({
          id: item.product_id, // Maps product_id back to your standard state 'id'
          quantity: item.quantity,
        }));
        
        // 5. Calculate global aggregate items for navigation counters/badges
        const totalCount = response.userCartRows.reduce((sum, item) => sum + item.quantity, 0);
        currentUserId = response.currentUserId;
        
        // 6. Push values directly into your main state setters
        // setCart(uiFormattedCart);
        setCartCount(totalCount);
      } else {
        setCartCount(0);
      }
        
        console.log(`✨ Local state hydrated seamlessly for User #${currentUserId} (${uiFormattedCart.length} items)`);

      } catch (error) {
        // 🛡️ Error Fallback: If local storage is corrupted JSON, reset state safely
        console.error("❌ Failed to parse local workspace or query Dexie:", error);
        setCart([]);
        setCartCount(0);
      }})();
  }, [setCart])

  // 🔄 1. The Core Cloudflare D1 & Dexie Sync Runner
  const syncCartWithServer = async (targetCartList: CartItem[]) => {
    // Format payload cleanly for the backend worker
    const payload = {
      cartItems: targetCartList.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      // 1. Retrieve the token from wherever your login system saved it
      const token = localStorage.getItem('session_token');
      // console.log(token);
      // 2. Pass it inside the headers object
      const response = await fetch('/api/cart/sync-confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // 🔑 THIS is how credentials are passed!
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Cloudflare sync failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // 🛡️ Safe Dexie Read-Write Transaction
        await localDb.transaction('rw', localDb.cart_items, async () => {
          await localDb.cart_items.clear();
          await localDb.cart_items.bulkPut(data.cart);
        });

        console.log(`🛒 Successfully synced cart`);
      }
    } catch (error) {
      console.error('❌ Sync failed:', error);
    }
  };

  // ➕ 2. The Integrated Add To Cart Event Trigger
  const addToCart = (product: JoinedProduct) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      let itemList: CartItem[] = [];

      // Clean conditional branching prevents array creation duplicates
      if (existingItem) {
        itemList = prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        itemList = [...prev, { ...product, quantity: 1 }];
      }

      // Track global visual badges accurately
      const totalCount = itemList.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalCount);

      // 🚀 Fire the sync instantly using the fresh, exact update array reference
      // This bypasses the async React batching delay completely!
      syncCartWithServer(itemList);

      return itemList;
    });
  };

  useEffect(() => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);

    // 📂 Future Expansion Hint: 
    // You can also back up your state to IndexedDB automatically here 
    // every time the 'cart' array morphs!
  }, [cart, setCartCount]);

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook with a "Safety Check"
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    // throw new Error("useCart must be used within a CartProvider");
    return { cart: [], cartCount, addToCart: () => { } };
  }
  return context;
};