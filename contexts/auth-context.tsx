'use client';

import React, { createContext, useContext, useEffect, useReducer, ReactNode, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}

// Add ApiConfig interface
interface ApiConfig {
  baseUrl: string;
  apiKey?: string;
  headers: Record<string, string>;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  checkAccess: (requiredRoles?: string[]) => boolean;
  enableDemoMode: () => void;
  disableDemoMode: () => void;
  apiConfig: ApiConfig; // Add apiConfig property
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.warn('useAuth must be used within an AuthProvider');
    return {
      user: null,
      loading: false,
      login: async () => {
        throw new Error('AuthProvider not initialized');
      },
      logout: async () => {
        throw new Error('AuthProvider not initialized');
      },
      isAuthenticated: false,
      isDemoMode: false,
      checkAccess: () => false,
      enableDemoMode: () => {},
      disableDemoMode: () => {},
      apiConfig: { // Add default apiConfig
        baseUrl: '/api',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    };
  }
  return context;
};

// Safe wrapper for useAuth that never throws errors
export const useConditionalAuth = () => {
  try {
    return useAuth();
  } catch (error) {
    return {
      user: null,
      loading: false,
      login: async () => {
        console.warn('Auth provider not available');
      },
      logout: async () => {
        console.warn('Auth provider not available');
      },
      isAuthenticated: false,
      isDemoMode: true, // Default to demo mode for public pages
      checkAccess: () => false,
      enableDemoMode: () => {},
      disableDemoMode: () => {},
      apiConfig: { // Add default apiConfig
        baseUrl: '/api',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    };
  }
};

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
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  // Add apiConfig state
  const [apiConfig, setApiConfig] = useState<ApiConfig>({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
    headers: {
      'Content-Type': 'application/json',
    }
  });

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

      if (isProtectedRoute && !user && !isDemoMode) {
        router.push('/login');
      }
    }
  }, [loading, user, isDemoMode, pathname]);

  useEffect(() => {
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

  const checkAccess = (requiredRoles?: string[]) => {
    if (!user) return false;
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return user.role ? requiredRoles.includes(user.role) : false;
  };

  const enableDemoMode = () => {
    setIsDemoMode(true);
    setUser(null);
  };

  const disableDemoMode = () => {
    setIsDemoMode(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user || isDemoMode,
        isDemoMode,
        enableDemoMode,
        disableDemoMode,
        checkAccess,
        apiConfig, // Add apiConfig to the context value
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
