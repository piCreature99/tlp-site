import { createContext, useContext, useState, type ReactNode } from 'react';

type ViewType = 'home' | 'details';

interface NavigationContextType {
  view: ViewType;
  selectedProduct: any | null;
  navigateToHome: () => void;
  navigateToDetails: (product: any) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewType>('home');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const navigateToHome = () => {
    setView('home');
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToDetails = (product: any) => {
    setSelectedProduct(product);
    setView('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <NavigationContext.Provider value={{ view, selectedProduct, navigateToHome, navigateToDetails }}>
      {children}
    </NavigationContext.Provider>
  );
}

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error('useNavigation must be used within a NavigationProvider');
  return context;
};