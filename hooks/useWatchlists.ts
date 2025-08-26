"use client";

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "@/lib/supabaseClient";

export function useWatchlists() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["watchlists"],
    queryFn: async () => {
      const { data, error } = await supabase.from("watchlists").select("id, name, items, created_at").order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  useEffect(() => {
    // only enable realtime when explicitly toggled to avoid noisy connections in test/dev environments
    const enabled = process?.env?.NEXT_PUBLIC_ENABLE_REALTIME === '1' || process?.env?.NEXT_PUBLIC_ENABLE_REALTIME === 'true';
    if (!enabled) return;

    let channel: any = null;
    try {
      channel = supabase
        .channel(`realtime:watchlists`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'watchlists' }, (payload: any) => {
          try { qc.invalidateQueries({ queryKey: ["watchlists"] }); } catch (e) { console.warn('realtime invalidate failed', e); }
        })
        .subscribe();
    } catch (e) {
      console.warn('watchlists realtime subscribe failed', e);
    }

    return () => {
      try {
        if (channel) {
          // prefer removeChannel when available
          if ((supabase as any).removeChannel) (supabase as any).removeChannel(channel);
          else channel.unsubscribe();
        }
      } catch (e) {
        // best-effort cleanup
      }
    };
  }, [qc]);

  return q;
}

export function useWatchlist(id?: string) {
  return useQuery({
    queryKey: ["watchlist", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase.from("watchlists").select("*").eq("id", id).maybeSingle();
      if (error) throw new Error(error.message);
      return data ?? null;
    },
    enabled: !!id,
  });
}

export function useCreateWatchlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; items: string[] }) => {
      const { data, error } = await supabase.from("watchlists").insert([payload]).select().maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["watchlists"] }),
  });
}

export function useCreateAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data, error } = await supabase.from("alerts").insert([payload]).select().maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts"] }),
  });
}

export function useUpdateAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, changes }: { id: string; changes: Record<string, any> }) => {
      const { data, error } = await supabase.from('alerts').update(changes).eq('id', id).select().maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts"] }),
  });
}

export function useDeleteAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('alerts').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return true;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts"] }),
  });
}

export function useAddSymbol(watchlistId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (symbol: string) => {
      if (!watchlistId) throw new Error('watchlist id required');
      const res = await fetch(`/api/watchlists/${watchlistId}/add`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ symbol }) });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Failed to add symbol: ${txt}`);
      }
      return true;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["watchlists"] })
  });
}

export function useUpdateWatchlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, changes }: { id: string; changes: Record<string, any> }) => {
      const { data, error } = await supabase.from('watchlists').update(changes).eq('id', id).select().maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["watchlists"] }),
  });
}

export function useDeleteWatchlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('watchlists').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return true;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["watchlists"] }),
  });
}

export function useAlerts() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("alerts").select("id, watchlist_id, condition, method, created_at").order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  useEffect(() => {
    try {
      const channel = supabase.channel('realtime-alerts')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, () => qc.invalidateQueries({ queryKey: ["alerts"] }))
        .subscribe();

      return () => { try { supabase.removeChannel(channel); } catch (e) { /* ignore */ } };
    } catch (e) {
      return () => undefined;
    }
  }, [qc]);

  return q;
}
