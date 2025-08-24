import { useQuery } from "@tanstack/react-query";
import { getPortfolios, portfolios as demoPortfolios } from "@/lib/demo-portfolios";

/**
 * Types used by the portfolio hook
 */
export type Allocation = {
  symbol: string;
  percent: number;
};

export type Position = {
  symbol: string;
  name?: string;
  quantity: number;
  avg_cost?: number;
  market_value?: number;
  pnl?: number;
};

export type Trade = {
  id: string;
  timestamp: string;
  symbol: string;
  side: "buy" | "sell";
  qty: number;
  price: number;
  fee?: number;
};

export type RebalanceAction = {
  symbol: string;
  currentPct: number;
  targetPct: number;
  action: "buy" | "sell" | "hold";
  qty?: number;
};

export type PortfolioSummary = {
  id: string;
  name: string;
  description?: string;
  valueUsd: number;
  dailyChangePct: number;
  pnlUsd: number;
  allocation: Allocation[];
};

export type PortfolioDetail = {
  id: string;
  name: string;
  description?: string;
  positions: Position[];
  allocation: Allocation[];
  history?: { timestamp: string; value: number; benchmark?: number }[];
  trades?: Trade[];
  recommendedRebalances?: RebalanceAction[];
  // any other fields provided by demo data
  [k: string]: any;
};

/**
 * Helper: normalize demo portfolio object into PortfolioSummary
 */
function toSummary(portfolio: any): PortfolioSummary {
  const allocation =
    portfolio.allocation?.map((a: any) => ({
      symbol: a.symbol ?? a.name ?? a.ticker ?? a.key ?? `${a.name ?? "unknown"}`,
      percent: typeof a.value === "number" ? a.value : a.percent ?? 0,
    })) ?? [];

  const valueUsd = portfolio.currentValue ?? portfolio.baseValue ?? portfolio.value ?? 0;

  const dailyChangePct = portfolio.dailyChangePct ?? portfolio.daily_change_pct ?? 0;
  const pnlUsd = portfolio.pnlUsd ?? portfolio.pnl ?? (valueUsd - (portfolio.costBasisRaw ?? 0)) ?? 0;

  return {
    id: portfolio.id,
    name: portfolio.name ?? portfolio.title ?? "Portfolio",
    description: portfolio.description,
    valueUsd,
    dailyChangePct,
    pnlUsd,
    allocation,
  };
}

/**
 * Hook: usePortfolioList
 * - Returns a list of portfolio summaries
 * - Prefers async getPortfolios() (may fetch real data), falls back to exported demo array
 */
export function usePortfolioList() {
  return useQuery<PortfolioSummary[], Error>({
    queryKey: ["portfolios", "list"],
    queryFn: async () => {
      try {
        const data = await getPortfolios();
        return data.map((p: any) => toSummary(p));
      } catch (err) {
        // Fallback to the synchronous demo export if async fetch fails
        return demoPortfolios.map((p: any) => toSummary(p));
      }
    },
    staleTime: 30_000,
  });
}

/**
 * Hook: usePortfolio (single by id)
 * - Returns a detailed portfolio object
 * - If not found, returns null
 */
export function usePortfolio(id?: string | null) {
  return useQuery<PortfolioDetail | null, Error>({
    queryKey: ["portfolios", id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const all = await getPortfolios();
        const found = all.find((p: any) => p.id === id) ?? demoPortfolios.find((p: any) => p.id === id);
        if (!found) return null;

        // Normalize a few fields for consumer convenience
        const detail: PortfolioDetail = {
          id: found.id,
          name: found.name ?? found.title,
          description: found.description,
          positions: found.positions ?? found.holdings ?? [],
          allocation:
            found.allocation?.map((a: any) => ({
              symbol: a.symbol ?? a.name ?? a.ticker,
              percent: typeof a.value === "number" ? a.value : a.percent ?? 0,
            })) ?? [],
          history: found.historicalData ?? found.history ?? [],
          trades: found.trades ?? found.trade_history ?? [],
          recommendedRebalances: found.recommendedRebalances ?? [],
          // spread the rest
          ...found,
        };

        return detail;
      } catch (err) {
        // Final fallback: try demo array
        const found = demoPortfolios.find((p: any) => p.id === id);
        if (!found) return null;
        const detail: PortfolioDetail = {
          id: found.id,
          name: found.name ?? found.title,
          description: found.description,
          positions: found.positions ?? found.holdings ?? [],
          allocation:
            found.allocation?.map((a: any) => ({
              symbol: a.symbol ?? a.name ?? a.ticker,
              percent: typeof a.value === "number" ? a.value : a.percent ?? 0,
            })) ?? [],
          history: found.historicalData ?? found.history ?? [],
          trades: found.trades ?? found.trade_history ?? [],
          recommendedRebalances: found.recommendedRebalances ?? [],
          ...found,
        };
        return detail;
      }
    },
    enabled: !!id,
    staleTime: 15_000,
  });
}

// Summary of Changes:
// - Added usePortfolioList and usePortfolio hooks backed by demo data/getPortfolios
// - Exports typed shapes for allocations, positions, trades and rebalances
