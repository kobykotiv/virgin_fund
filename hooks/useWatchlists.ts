// hooks/useWatchlists.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAlerts, useCreateAlert, useUpdateAlert, useDeleteAlert } from './useAlerts'

export interface Watchlist {
  id: string;
  name: string;
  items: string[];
  provider: 'alpaca' | 'coingecko';
  created_at: string;
  updated_at?: string;
}

export interface CreateWatchlistData {
  name: string;
  items: string[];
  provider?: 'alpaca' | 'coingecko';
}

export interface UpdateWatchlistData {
  id: string;
  name?: string;
  items?: string[];
  changes?: Partial<{
    items: string[]
    name: string
  }>;
  provider?: 'alpaca' | 'coingecko';
}

export function useWatchlists() {
  return useQuery({
    queryKey: ['watchlists'],
    queryFn: async (): Promise<Watchlist[]> => {
      const res = await fetch('/api/watchlists');
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Failed to fetch watchlists');
      return data.watchlists;
    },
    staleTime: 30_000,
  });
}

export function useCreateWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (watchlistData: CreateWatchlistData): Promise<Watchlist> => {
      const res = await fetch('/api/watchlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(watchlistData),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Failed to create watchlist');
      return data.watchlist;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlists'] });
    },
  });
}

export function useUpdateWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (watchlistData: UpdateWatchlistData): Promise<Watchlist> => {
      const res = await fetch('/api/watchlists', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(watchlistData),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Failed to update watchlist');
      return data.watchlist;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlists'] });
    },
  });
}

export function useDeleteWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const res = await fetch(`/api/watchlists?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Failed to delete watchlist');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlists'] });
    },
  });
}

// Re-export alert hooks expected by some components for convenience.
export { useAlerts, useCreateAlert, useUpdateAlert, useDeleteAlert };

// Small helpers expected by UI components
export function useWatchlist(id?: string) {
  return useQuery({
    queryKey: ['watchlist', id],
    queryFn: async () => {
      if (!id) return null
      const res = await fetch(`/api/watchlists/${id}`)
      if (!res.ok) throw new Error('Failed to fetch watchlist')
      const data = await res.json()
      return data.watchlist ?? data
    },
    enabled: !!id,
  })
}

export function useAddSymbol(watchlistId?: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { id?: string; symbol: string } | string) => {
      let id: string | undefined
      let symbol: string
      if (typeof payload === 'string') {
        id = watchlistId
        symbol = payload
      } else {
        id = payload.id || watchlistId
        symbol = payload.symbol
      }
      if (!id) throw new Error('watchlist id required')
      const res = await fetch(`/api/watchlists/${id}/add`, { method: 'POST', body: JSON.stringify({ symbol }), headers: { 'Content-Type': 'application/json' } })
      if (!res.ok) throw new Error('Failed to add symbol')
      return res.json()
    },
    onSuccess: (_, vars) => {
      const maybeId = typeof vars === 'string' ? watchlistId : (vars as any)?.id || watchlistId
      qc.invalidateQueries({ queryKey: ['watchlists', maybeId] })
    },
  })
}
