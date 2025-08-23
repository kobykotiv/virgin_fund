/**
 * hooks/usePerformanceSupabase.ts
 *
 * React Query hook to fetch user-scoped backtests and keep them updated via Supabase realtime.
 *
 * - Fetches the current authenticated user (client-side) and loads backtests for that user's bots.
 * - Subscribes to Postgres changes on `backtests` and `order_records` (trade log changes) and updates
 *   the React Query cache incrementally to provide near-realtime UI updates.
 *
 * Notes:
 * - Uses the public supabase client (browser-safe anon key) exported from `lib/supabaseClient`.
 * - Returns a minimal interface compatible with existing consumers: { data, isLoading, isError, refetch }.
 *
 * Future improvements:
 * - Map to a strongly-typed BacktestResult shape (depends on `types/backtest.ts` contract).
 * - Add optimistic updates for mutations (create / update backtests) where applicable.
 */

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import supabase from "@/lib/supabaseClient";
import type { BacktestResult } from "@/types/backtest";

/**
 * Query key used for storing backtests in the react-query cache.
 */
const QUERY_KEY = ["performance", "backtests"];

/**
 * Helper: load the current authenticated user via Supabase client.
 */
async function getCurrentUserId(): Promise<string | null> {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) {
      // auth.getUser may surface an error when no session exists; treat as unauthenticated
      return null;
    }
    return user?.id ?? null;
  } catch {
    return null;
  }
}

/**
 * Fetch backtests for the current user.
 * Implementation detail: we first load the user's bot ids and then fetch backtests
 * that reference those bot ids. This avoids relying on cross-table filtering semantics.
 */
async function fetchBacktestsForUser(userId: string | null): Promise<BacktestResult[]> {
  if (!userId) return [];

  // 1) fetch bot ids for the user
  const { data: bots, error: botsError } = await supabase
    .from("bots")
    .select("id")
    .eq("user_id", userId);

  if (botsError) {
    throw botsError;
  }

  const botIds = (bots || []).map((b: any) => b.id);
  if (botIds.length === 0) return [];

  // 2) fetch backtests for these bot ids
  const { data: backtests, error: backtestsError } = await supabase
    .from("backtests")
    .select("id, bot_id, params, results, summary, created_at")
    .in("bot_id", botIds);

  if (backtestsError) {
    throw backtestsError;
  }

  // Minimal cast to BacktestResult[]; mapping/normalization can be added later.
  return (backtests || []) as BacktestResult[];
}

/**
 * usePerformanceSupabase
 *
 * Public hook for performance data powered by Supabase + React Query.
 */
export function usePerformanceSupabase() {
  const qc = useQueryClient();

  const query = useQuery<BacktestResult[], Error>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const userId = await getCurrentUserId();
      const backtests = await fetchBacktestsForUser(userId);
      return backtests;
    },
    // stale time - small so UI stays relatively fresh but avoids hot refetch loops
    staleTime: 5_000,
  });

  useEffect(() => {
    let channel: ReturnType<typeof supabase['channel']> | null = null;
    let orderChannel: ReturnType<typeof supabase['channel']> | null = null;

    // Subscribe to `backtests` changes and update cache incrementally
    try {
      channel = supabase
        .channel("public:backtests")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "backtests" },
          (payload) => {
            qc.setQueryData<BacktestResult[] | undefined>(QUERY_KEY, (old) => {
              const prev = old ? [...old] : [];
              const newRow = payload.new as any;
              const oldRow = payload.old as any;

              switch (payload.eventType) {
                case "INSERT": {
                  // avoid duplicates
                  if (!prev.find((p) => p.id === newRow.id)) {
                    return [newRow, ...prev];
                  }
                  return prev;
                }
                case "UPDATE": {
                  return prev.map((p) => (p.id === newRow.id ? newRow : p));
                }
                case "DELETE": {
                  return prev.filter((p) => p.id !== oldRow.id);
                }
                default:
                  return prev;
              }
            });
          }
        )
        .subscribe();
    } catch (e) {
      // If realtime setup fails, fall back to no subscription (non-fatal)
      // console.warn("Failed to subscribe to backtests realtime:", e);
      channel = null;
    }

    // Subscribe to order_records changes; these are trade-level changes and
    // usually require a shallow refetch so consumers get updated trade logs.
    try {
      orderChannel = supabase
        .channel("public:order_records")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "order_records" },
          () => {
            // Invalidate so the query function refetches and merges latest trade data.
            void qc.invalidateQueries({ queryKey: QUERY_KEY });
          }
        )
        .subscribe();
    } catch (e) {
      orderChannel = null;
    }

    return () => {
      // cleanup subscriptions on unmount
      if (channel) void channel.unsubscribe();
      if (orderChannel) void orderChannel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qc]);

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export default usePerformanceSupabase;
