import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type Bot = {
  id: string;
  user_id?: string;
  name: string;
  strategy: string;
  status?: string;
  capital?: number;
  pnl?: number;
  last_trade_at?: string | null;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
};

type CreateBotPayload = {
  name: string;
  strategy: string;
  capital?: number;
  // Optional runtime fields allowed when creating/updating bots
  status?: string;
  pnl?: number;
  metadata?: Record<string, unknown>;
};

type UpdateBotPayload = Partial<CreateBotPayload> & { id: string };

/**
 * Hooks use server-side /api/bots endpoints.
 * Server routes validate vf_session cookie and scope DB ops to authenticated user.
 */

export function useBots() {
  return useQuery({
    queryKey: ["bots"],
    queryFn: async (): Promise<Bot[]> => {
      const res = await fetch("/api/bots", { credentials: "same-origin" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to fetch bots");
      return (json.bots ?? []) as Bot[];
    },
  });
}

export function useCreateBot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateBotPayload) => {
      const res = await fetch("/api/bots", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to create bot");
      return json.bot as Bot;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bots"] }),
  });
}

export function useUpdateBot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateBotPayload) => {
      if (!payload.id) throw new Error("Missing bot id");
      const res = await fetch(`/api/bots/${encodeURIComponent(payload.id)}`, {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to update bot");
      return json.bot as Bot;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bots"] }),
  });
}

export function useDeleteBot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!id) throw new Error("Missing bot id");
      const res = await fetch(`/api/bots/${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to delete bot");
      return json;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bots"] }),
  });
}
