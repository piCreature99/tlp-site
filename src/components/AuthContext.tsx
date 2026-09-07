import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

// 1. Define what the User looks like
export interface UserProfile {
  id: number;
  email: string;
  name: string;
  display_name: string;
  picture: string;
  role: string;
  created_at: string;
  last_login: string;
}

// 2. Define what the Context provides
interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (userData: UserProfile, token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
        // console.log("Hello");
    // HYDRATION: Load from localStorage when the app first starts
    const savedUser = localStorage.getItem('user_profile');
    const token = localStorage.getItem('session_token');
    // console.log(savedUser);
    if (savedUser && savedUser !== "undefined" && token) {
      return JSON.parse(savedUser);
    }
    return null;
  });
  // const [loading, setLoading] = useState(false);
  const loading = false;
  // console.log(user);
  
  useEffect(() => {

  }, []);
  
  const login = (userData: UserProfile, token: string) => {
    localStorage.setItem('session_token', token);
    localStorage.setItem('user_profile', JSON.stringify(userData));
    setUser(userData);
  };
  
  const logout = () => {
    localStorage.removeItem('session_token');
    localStorage.removeItem('user_profile');
    setUser(null);
  };
  // console.log("Hello2");
  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom Hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};