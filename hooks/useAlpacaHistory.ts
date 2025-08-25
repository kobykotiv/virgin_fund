import { useQuery } from "@tanstack/react-query";

type HistoryParams = {
  page?: number;
  limit?: number;
  status?: string;
  bot_id?: string | number;
};

export function useAlpacaHistory(params: HistoryParams = {}) {
  const { page = 1, limit = 50, status, bot_id } = params;

  const queryKey = ["alpaca", "history", { page, limit, status, bot_id }];

  return useQuery({
    queryKey,
    queryFn: async () => {
      const qs = new URLSearchParams();
      qs.set("page", String(page));
      qs.set("limit", String(limit));
      if (status) qs.set("status", status);
      if (bot_id !== undefined && bot_id !== null) qs.set("bot_id", String(bot_id));

      const res = await fetch(`/api/alpaca/history?${qs.toString()}`);
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error || "Failed to fetch Alpaca order history");
      }
      return res.json();
    },
    staleTime: 1000 * 30,
    refetchInterval: false,
  });
}
