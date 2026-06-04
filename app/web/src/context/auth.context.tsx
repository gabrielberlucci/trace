import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

export interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('is_logged_in') === 'true';
  });

  const login = useCallback(() => {
    localStorage.setItem('is_logged_in', 'true');
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('is_logged_in');
    setIsAuthenticated(false);

    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const isLogged = localStorage.getItem('is_logged_in') === 'true';
      setIsAuthenticated(isLogged);
      if (!isLogged && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider.');
  }
  return context;
}
