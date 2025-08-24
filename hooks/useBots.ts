// hooks/useBots.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Bot } from "types/bot";

async function fetchBots(): Promise<Bot[]> {
  const res = await fetch("/api/bots");
  if (!res.ok) return [];
  const json = await res.json();
  return json?.data ?? [];
}

export default function useBots() {
  return useQuery<Bot[]>({
    queryKey: ["bots"],
    queryFn: fetchBots,
    staleTime: 10_000,
  });
}

export function useCreateBot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Bot>) => {
      const res = await fetch("/api/bots", { method: "POST", body: JSON.stringify(payload), headers: { "Content-Type": "application/json" } });
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bots"] }),
  });
}

export function useUpdateBot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Bot> }) => {
      const res = await fetch(`/api/bots/${id}`, { method: "PATCH", body: JSON.stringify(patch), headers: { "Content-Type": "application/json" } });
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bots"] }),
  });
}

export function useDeleteBot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/bots/${id}`, { method: "DELETE" });
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bots"] }),
  });
}

export function useStartBot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/bots/${id}/start`, { method: "POST" });
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bots"] }),
  });
}

export function usePauseBot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/bots/${id}/pause`, { method: "POST" });
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bots"] }),
  });
}

export function useStopBot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/bots/${id}/stop`, { method: "POST" });
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bots"] }),
  });
}

// Summary of Changes:
// - Implemented all bot CRUD and control hooks using React Query.
// - All hooks invalidate the "bots" query on mutation success.
// - fetchBots expects /api/bots to return { data }.
// - Use this file for bot management UI and tests.
