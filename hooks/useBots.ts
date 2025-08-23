import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/providers/auth-provider";

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
  // Use demo mode when the AuthProvider toggles it on (client-side only)
  const { isDemoMode } = useAuth();

  if (isDemoMode) {
    return useQuery({
      queryKey: ["bots", "demo"],
      // Return mocked demo bots (Bitcoin priced at $420.69, 2013-like dates)
      queryFn: async (): Promise<Bot[]> => {
        // simulate small network latency
        await new Promise((r) => setTimeout(r, 200));
        const btcPrice = 420.69;
        const now = new Date().toISOString();
        const bots: Bot[] = [
          {
            id: "demo-bot-1",
            user_id: "demo-user",
            name: "Satoshi Basket",
            strategy: "basket",
            status: "active",
            capital: 5000,
            pnl: 320.5,
            last_trade_at: new Date("2013-08-20T12:00:00Z").toISOString(),
            metadata: {
              type: "basket",
              assets: ["BTC", "LTC", "DOGE"],
              allocation: 2500,
              description: "Demo basket targeting BTC & early altcoins",
              lastTradeAt: new Date("2013-08-20T12:00:00Z").toISOString(),
            },
            created_at: new Date("2013-03-01T08:00:00Z").toISOString(),
            updated_at: now,
          },
          {
            id: "demo-bot-2",
            user_id: "demo-user",
            name: "Lite DCA",
            strategy: "dca",
            status: "paused",
            capital: 2000,
            pnl: -42.69,
            last_trade_at: new Date("2013-06-10T09:30:00Z").toISOString(),
            metadata: {
              type: "dca",
              assets: ["LTC"],
              allocation: 1200,
              description: "Dollar-cost averaging into Litecoin (2013 demo)",
              lastTradeAt: new Date("2013-06-10T09:30:00Z").toISOString(),
            },
            created_at: new Date("2013-01-15T07:00:00Z").toISOString(),
            updated_at: now,
          },
          {
            id: "demo-bot-3",
            user_id: "demo-user",
            name: "Grid Doge",
            strategy: "grid",
            status: "paused",
            capital: 1000,
            pnl: 10.0,
            last_trade_at: new Date("2013-04-05T15:20:00Z").toISOString(),
            metadata: {
              type: "grid",
              assets: ["DOGE"],
              allocation: 800,
              description: "Grid strategy for Dogecoin (playful demo)",
              lastTradeAt: new Date("2013-04-05T15:20:00Z").toISOString(),
            },
            created_at: new Date("2013-02-10T11:00:00Z").toISOString(),
            updated_at: now,
          },
        ];
        return bots;
      },
      // keep data fresh in-memory for demo sessions
      staleTime: 1000 * 60 * 5,
    });
  }

  // Default: call the real backend API
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
