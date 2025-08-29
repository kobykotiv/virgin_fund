import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Enhanced Portfolio Hooks with Full CRUD Operations
 */

export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  currency: string;
  balance: number;
  created_at: string;
  updated_at?: string;
  // Additional fields for UI
  allocation?: Allocation[];
  positions?: Position[];
  history?: HistoryPoint[];
  trades?: Trade[];
  valueUsd?: number;
  dailyChangePct?: number;
  pnlUsd?: number;
}

export interface Allocation {
  symbol: string;
  percent: number;
  value?: number;
}

export interface Position {
  symbol: string;
  name?: string;
  quantity: number;
  avg_cost?: number;
  market_value?: number;
  pnl?: number;
  pnl_percent?: number;
}

export interface HistoryPoint {
  timestamp: string;
  value: number;
  benchmark?: number;
}

export interface Trade {
  id: string;
  timestamp: string;
  symbol: string;
  side: "buy" | "sell";
  qty: number;
  price: number;
  fee?: number;
  total_value?: number;
}

export interface CreatePortfolioData {
  name: string;
  description?: string;
  currency?: string;
  balance?: number;
  allocation?: Allocation[];
}

export interface UpdatePortfolioData {
  id: string;
  name?: string;
  description?: string;
  currency?: string;
  balance?: number;
  allocation?: Allocation[];
}

// Fetch all portfolios
export function usePortfolios() {
  return useQuery({
    queryKey: ['portfolios'],
    queryFn: async (): Promise<Portfolio[]> => {
      const res = await fetch('/api/portfolios');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch portfolios');
      return data.portfolios || [];
    },
    staleTime: 30_000,
  });
}

// Fetch single portfolio
export function usePortfolio(id?: string | null) {
  return useQuery({
    queryKey: ['portfolio', id],
    queryFn: async (): Promise<Portfolio | null> => {
      if (!id) return null;
      const res = await fetch(`/api/portfolios/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch portfolio');
      return data.portfolio || null;
    },
    enabled: !!id,
    staleTime: 15_000,
  });
}

// Create portfolio
export function useCreatePortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (portfolioData: CreatePortfolioData): Promise<Portfolio> => {
      const res = await fetch('/api/portfolios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(portfolioData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create portfolio');
      return data.portfolio;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
}

// Update portfolio
export function useUpdatePortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (portfolioData: UpdatePortfolioData): Promise<Portfolio> => {
      const { id, ...updateData } = portfolioData;
      const res = await fetch(`/api/portfolios/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update portfolio');
      return data.portfolio;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio', data.id] });
    },
  });
}

// Delete portfolio
export function useDeletePortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const res = await fetch(`/api/portfolios/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete portfolio');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
}

// Portfolio positions management
export function useAddPosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { portfolioId: string; position: Omit<Position, 'id'> }) => {
      const res = await fetch(`/api/portfolios/${payload.portfolioId}/positions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload.position),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add position');
      return data.position;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['portfolio', variables.portfolioId] });
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
}

export function useUpdatePosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { portfolioId: string; positionId: string; updates: Partial<Position> }) => {
      const res = await fetch(`/api/portfolios/${payload.portfolioId}/positions/${payload.positionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload.updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update position');
      return data.position;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['portfolio', variables.portfolioId] });
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
}

export function useDeletePosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { portfolioId: string; positionId: string }) => {
      const res = await fetch(`/api/portfolios/${payload.portfolioId}/positions/${payload.positionId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete position');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['portfolio', variables.portfolioId] });
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
}

// Portfolio rebalancing
export function useRebalancePortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { portfolioId: string; targetAllocation: Allocation[] }) => {
      const res = await fetch(`/api/portfolios/${payload.portfolioId}/rebalance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetAllocation: payload.targetAllocation }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to rebalance portfolio');
      return data.result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['portfolio', variables.portfolioId] });
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
}

// Portfolio analytics
export function usePortfolioAnalytics(id?: string) {
  return useQuery({
    queryKey: ['portfolio-analytics', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await fetch(`/api/portfolios/${id}/analytics`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch analytics');
      return data.analytics;
    },
    enabled: !!id,
    staleTime: 60_000,
  });
}

// Export legacy hooks for compatibility
export { usePortfolios as usePortfolioList, usePortfolio };

// Summary of Changes:
// - Added comprehensive CRUD operations for portfolios
// - Enhanced types with proper TypeScript interfaces
// - Added position management hooks
// - Added rebalancing and analytics hooks
// - Maintained compatibility with existing code