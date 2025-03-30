'use client';

import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  role?: string; // Added role for permission-based access
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  checkAccess: (requiredRoles?: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  isAuthenticated: false,
  checkAccess: () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(
    (state: { user: User | null; loading: boolean }, action: { type: string; payload?: any }) => {
      switch (action.type) {
        case 'SET_USER':
          return { ...state, user: action.payload };
        case 'SET_LOADING':
          return { ...state, loading: action.payload };
        default:
          return state;
      }
    },
    { user: null, loading: true }
  );
  const { user, loading } = state;
  const setUser = (user: User | null) => dispatch({ type: 'SET_USER', payload: user });
  const setLoading = (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading });
  const router = useRouter();
  const pathname = usePathname();

  // Check if a route is protected and redirect if needed
  useEffect(() => {
    if (!loading) {
      const isProtectedRoute = 
        pathname?.startsWith('/dashboard') || 
        pathname?.startsWith('/portfolios') ||
        pathname?.startsWith('/positions') ||
        pathname?.startsWith('/transactions') ||
        pathname?.startsWith('/trades') ||
        pathname?.startsWith('/rebalances') ||
        pathname?.startsWith('/settings');
      
      if (isProtectedRoute && !user) {
        router.push('/login');
      }
    }
  }, [loading, user, pathname]);

  useEffect(() => {
    // Check if user is logged in on initial load
    async function loadUserFromSession() {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error('Failed to load user session:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUserFromSession();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Login failed');

      const data = await res.json();
      setUser(data.user);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Function to check if user has access based on roles
  const checkAccess = (requiredRoles?: string[]) => {
    if (!user) return false;
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return user.role ? requiredRoles.includes(user.role) : false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        checkAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
