import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './auth-context';

interface NavItem {
  _id: string;
  name: string;
  path: string;
  icon?: string;
  requiredRoles?: string[];
  order: number;
  active: boolean;
  isPublic?: boolean; // Add this to identify public navigation items
}

interface NavigationContextType {
  navItems: NavItem[];
  loading: boolean;
  refreshNavItems: () => Promise<void>;
  addNavItem: (item: Omit<NavItem, '_id'>) => Promise<void>;
  updateNavItem: (id: string, item: Partial<NavItem>) => Promise<void>;
  deleteNavItem: (id: string) => Promise<void>;
}

const NavigationContext = createContext<NavigationContextType>({
  navItems: [],
  loading: true,
  refreshNavItems: async () => {},
  addNavItem: async () => {},
  updateNavItem: async () => {},
  deleteNavItem: async () => {},
});

export const useNavigation = () => useContext(NavigationContext);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, checkAccess, isAuthenticated } = useAuth();

  const refreshNavItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/navigation');
      if (res.ok) {
        const data = await res.json();
        
        // Filter navigation items based on authentication status and permissions
        const filteredItems = data.filter((item: NavItem) => {
          // Always show active public items
          if (item.active && item.isPublic) {
            return true;
          }
          
          // For private items, check authentication and permissions
          if (!isAuthenticated) {
            return false;
          }
          
          return item.active && (!item.requiredRoles || checkAccess(item.requiredRoles));
        });
        
        setNavItems(filteredItems.sort((a: NavItem, b: NavItem) => a.order - b.order));
      }
    } catch (error) {
      console.error('Failed to load navigation items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNavItem = async (item: Omit<NavItem, '_id'>) => {
    try {
      const res = await fetch('/api/navigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        await refreshNavItems();
      }
    } catch (error) {
      console.error('Failed to add navigation item:', error);
      throw error;
    }
  };

  const updateNavItem = async (id: string, item: Partial<NavItem>) => {
    try {
      const res = await fetch(`/api/navigation/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        await refreshNavItems();
      }
    } catch (error) {
      console.error('Failed to update navigation item:', error);
      throw error;
    }
  };

  const deleteNavItem = async (id: string) => {
    try {
      const res = await fetch(`/api/navigation/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await refreshNavItems();
      }
    } catch (error) {
      console.error('Failed to delete navigation item:', error);
      throw error;
    }
  };

  useEffect(() => {
    // Always fetch navigation items, not just when user is logged in
    refreshNavItems();
  }, [user]); // Still depend on user to re-fetch when auth state changes

  return (
    <NavigationContext.Provider
      value={{
        navItems,
        loading,
        refreshNavItems,
        addNavItem,
        updateNavItem,
        deleteNavItem,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
