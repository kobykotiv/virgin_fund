import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type Strategy = {
  id: string;
  user_id?: string;
  name: string;
  description?: string | null;
  parameters?: Record<string, unknown> | null;
  is_public?: boolean;
  created_at?: string;
  updated_at?: string;
};

type CreateStrategyPayload = {
  name: string;
  description?: string;
  parameters?: Record<string, unknown>;
  is_public?: boolean;
};

type UpdateStrategyPayload = Partial<CreateStrategyPayload> & { id: string };

/**
 * Hooks for interacting with /api/strategies endpoints.
 * Patterns follow hooks/useBots.ts for consistency.
 */

export function useStrategies() {
  return useQuery({
    queryKey: ["strategies"],
    queryFn: async (): Promise<Strategy[]> => {
      const res = await fetch("/api/strategies", { credentials: "same-origin" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to fetch strategies");
      return (json.strategies ?? []) as Strategy[];
    },
  });
}

export function useCreateStrategy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateStrategyPayload) => {
      const res = await fetch("/api/strategies", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to create strategy");
      return json.strategy as Strategy;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["strategies"] }),
  });
}

export function useUpdateStrategy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateStrategyPayload) => {
      if (!payload.id) throw new Error("Missing strategy id");
      const { id, ...rest } = payload;
      const res = await fetch(`/api/strategies/${encodeURIComponent(id)}`, {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rest),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to update strategy");
      return json.strategy as Strategy;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["strategies"] }),
  });
}

export function useDeleteStrategy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!id) throw new Error("Missing strategy id");
      const res = await fetch(`/api/strategies/${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to delete strategy");
      return json;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["strategies"] }),
  });
}
