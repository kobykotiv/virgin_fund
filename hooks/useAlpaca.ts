import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hooks for Alpaca integration
 *
 * - useAlpacaAccount: fetches /api/alpaca/account via react-query
 * - usePlaceAlpacaOrder: posts to /api/alpaca/orders and invalidates relevant caches on success
 *
 * Uses object-style API for @tanstack/react-query to match repo typings.
 */

export function useAlpacaAccount() {
  return useQuery({
    queryKey: ["alpaca", "account"],
    queryFn: async () => {
      const res = await fetch("/api/alpaca/account");
      if (!res.ok) throw new Error("Failed to fetch Alpaca account");
      return res.json();
    },
    staleTime: 1000 * 30,
    refetchInterval: 30_000,
  });
}

export function usePlaceAlpacaOrder() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      symbol: string;
      qty: number;
      side: "buy" | "sell";
      type?: string;
      time_in_force?: string;
      limit_price?: number;
      client_order_id?: string;
    }) => {
      const res = await fetch("/api/alpaca/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error || "Alpaca order failed");
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["alpaca", "account"] });
      qc.invalidateQueries({ queryKey: ["bots"] });
    },
  });
}
