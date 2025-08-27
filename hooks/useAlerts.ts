"use client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import supabase from "@/lib/supabaseClient";

export interface Alert {
  id: string;
  name?: string;
  symbol?: string;
  watchlist_id?: string | null;
  condition?: {
    symbol?: string;
    op?: '<=' | '>=' | '==' | '!=' | 'above' | 'below' | 'equals' | 'crosses_above' | 'crosses_below';
    price?: number;
    volume?: number;
  };
  method?: 'in_app' | 'email' | 'webhook';
  payload?: Record<string, any>;
  provider?: 'alpaca' | 'coingecko';
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAlertData {
  name?: string;
  user_id?: string | null;
  watchlist_id?: string | null;
  condition: {
    op: '<=' | '>=' | '==' | '!=' | 'above' | 'below' | 'equals' | 'crosses_above' | 'crosses_below';
    price: number;
    volume?: number;
    symbol?: string;
  };
  method?: 'in_app' | 'email' | 'webhook';
  payload?: Record<string, any>;
  provider?: 'alpaca' | 'coingecko';
}

export interface UpdateAlertData {
  id: string;
  name?: string;
  symbol?: string;
  watchlist_id?: string | null;
  condition?: {
    op?: '<=' | '>=' | '==' | '!=' | 'above' | 'below' | 'equals' | 'crosses_above' | 'crosses_below';
    price?: number;
    volume?: number;
    symbol?: string;
  };
  method?: 'in_app' | 'email' | 'webhook';
  payload?: Record<string, any>;
  provider?: 'alpaca' | 'coingecko';
  is_active?: boolean;
}

export function useAlerts() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['alerts'],
    queryFn: async (): Promise<Alert[]> => {
      const res = await fetch('/api/alerts');
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Failed to fetch alerts');
      return data.alerts;
    },
    staleTime: 30_000,
  });

  // Supabase realtime subscription for alerts
  useEffect(() => {
    const channel = supabase
      .channel('alerts-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'alerts'
      }, () => {
        // Invalidate and refetch alerts when database changes
        queryClient.invalidateQueries({ queryKey: ['alerts'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
}

export function useCreateAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (alertData: CreateAlertData): Promise<Alert> => {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alertData),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Failed to create alert');
      return data.alert;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}

export function useUpdateAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    // Accept either an UpdateAlertData or { id: string; changes: Partial<UpdateAlertData> }
    mutationFn: async (alertPayload: UpdateAlertData | { id: string; changes: Partial<UpdateAlertData> }): Promise<Alert> => {
      const payload = ('changes' in (alertPayload as any)) ? { id: (alertPayload as any).id, ...((alertPayload as any).changes) } : alertPayload;
      const res = await fetch('/api/alerts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Failed to update alert');
      return data.alert;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}

export function useDeleteAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const res = await fetch(`/api/alerts?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Failed to delete alert');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}

export function useTriggerAlerts() {
  return useMutation({
    mutationFn: async (): Promise<{ triggeredCount: number; triggeredAlerts: any[] }> => {
      const res = await fetch('/api/alerts/trigger', {
        method: 'POST',
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Failed to trigger alerts');
      return data;
    },
  });
}
