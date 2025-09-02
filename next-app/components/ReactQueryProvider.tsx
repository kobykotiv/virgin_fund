'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

/**
 * React Query Provider with optimized configuration for Trading Agent app
 * Provides caching, background refetching, and error handling for API calls
 */

interface ReactQueryProviderProps {
  children: ReactNode;
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time - how long data is considered fresh
            staleTime: 1000 * 60 * 5, // 5 minutes
            
            // Cache time - how long inactive data stays in cache  
            gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
            
            // Refetch on window focus for real-time data
            refetchOnWindowFocus: true,
            
            // Refetch on reconnect after network issues
            refetchOnReconnect: true,
            
            // Retry failed requests
            retry: (failureCount, error: any) => {
              // Don't retry on 4xx errors (client errors)
              if (error?.status >= 400 && error?.status < 500) {
                return false;
              }
              // Retry up to 3 times for other errors
              return failureCount < 3;
            },
            
            // Retry delay with exponential backoff
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            // Retry mutations on network errors
            retry: (failureCount, error: any) => {
              // Don't retry client errors
              if (error?.status >= 400 && error?.status < 500) {
                return false;
              }
              return failureCount < 2;
            },
            
            // Show loading state during mutations
            onMutate: () => {
              // Could add global loading state here
            },
            
            onError: (error: any) => {
              console.error('Mutation error:', error);
              // Could add global error handling here
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

/**
 * Query keys for consistent cache management
 * Organized by feature area for easy invalidation
 */
export const queryKeys = {
  // Portfolio queries
  portfolio: {
    all: ['portfolio'] as const,
    status: () => [...queryKeys.portfolio.all, 'status'] as const,
    heatmap: () => [...queryKeys.portfolio.all, 'heatmap'] as const,
  },
  
  // Trading queries
  trading: {
    all: ['trading'] as const,
    open: () => [...queryKeys.trading.all, 'open'] as const,
    history: (limit?: number, offset?: number) => 
      [...queryKeys.trading.all, 'history', { limit, offset }] as const,
  },
  
  // Analysis queries
  analysis: {
    all: ['analysis'] as const,
    status: () => [...queryKeys.analysis.all, 'status'] as const,
    indicators: (symbol: string, timeframe?: string) => 
      [...queryKeys.analysis.all, 'indicators', symbol, timeframe] as const,
    news: (symbol: string) => 
      [...queryKeys.analysis.all, 'news', symbol] as const,
  },
  
  // Scheduler queries
  scheduler: {
    all: ['scheduler'] as const,
    jobs: () => [...queryKeys.scheduler.all, 'jobs'] as const,
  },
  
  // Reports queries
  reports: {
    all: ['reports'] as const,
    pnl: (period?: string) => 
      [...queryKeys.reports.all, 'pnl', period] as const,
    metrics: () => [...queryKeys.reports.all, 'metrics'] as const,
  },
  
  // Settings queries
  settings: {
    all: ['settings'] as const,
    profile: () => [...queryKeys.settings.all, 'profile'] as const,
    integrations: () => [...queryKeys.settings.all, 'integrations'] as const,
  },
};

/**
 * Query options factory for commonly used queries
 * Provides consistent configuration across components
 */
export const queryOptions = {
  // Portfolio queries with frequent updates
  portfolio: {
    refetchInterval: 30000, // 30 seconds
    staleTime: 1000 * 60, // 1 minute
  },
  
  // Trading data that changes less frequently
  trading: {
    refetchInterval: 60000, // 1 minute
    staleTime: 1000 * 60 * 2, // 2 minutes
  },
  
  // Analysis data that's more static
  analysis: {
    refetchInterval: false,
    staleTime: 1000 * 60 * 10, // 10 minutes
  },
  
  // Reports that update infrequently
  reports: {
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    staleTime: 1000 * 60 * 15, // 15 minutes
  },
  
  // Settings that rarely change
  settings: {
    refetchInterval: false,
    staleTime: 1000 * 60 * 30, // 30 minutes
  },
};