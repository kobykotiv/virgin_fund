import type { BacktestParams } from "@/types/backtest";
import type { Bot } from "@/types/bot";
import { normalizeEngineResult } from "@/lib/backtest-adapter";

/**
 * Client-side helper to call POST /api/backtest
 *
 * This maps the in-UI BacktestParams shape to the server-side API expected body.
 * The function intentionally accepts a Bot so callers can pass the selected bot object
 * (legacy code previously called runBacktest(selectedBot, params)).
 *
 * Note: callers should handle UI loading state and errors.
 */
export async function runBacktest(bot: Bot, params: BacktestParams) {
  if (!bot && !params.botId) {
    throw new Error("Missing bot or parameters for backtest");
  }

  // Prefer explicit symbol if provided on params, else try first asset from bot
  const symbol =
    (params as any).symbol ??
    (bot as any)?.assets?.[0] ??
    (bot as any)?.symbol ??
    (bot as any)?.ticker ??
    null;

  if (!symbol) {
    throw new Error("Unable to determine symbol for backtest");
  }

  const body = {
    // server expects: symbol, start, end, initialCapital, dcaAmount, frequency, slippagePct, commission
    symbol,
    start: params.startDate,
    end: params.endDate,
    initialCapital: params.initialCapital ?? 0,
    // BacktestParams doesn't include dcaAmount; default to 0
    dcaAmount: (params as any).dcaAmount ?? 0,
    // Frequency not present on BacktestParams; default to daily
    frequency: (params as any).frequency ?? "daily",
    // Map slippage -> slippagePct (UI uses 0-1 sliders)
    slippagePct: params.slippage ?? (params as any).slippagePct ?? 0,
    commission: params.commission ?? 0,
    // keep dataSource for informational/debugging use on server if provided
    dataSource: params.dataSource ?? "mock",
  };

  const res = await fetch("/api/backtest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({} as any));

  if (!res.ok) {
    const errMsg = (data && data.error) || `Backtest API error: ${res.status}`;
    throw new Error(errMsg);
  }

  // Server responds with { result } where result contains { timeseries, trades, summary }
  // Normalize engine result into canonical BacktestResult for UI components
  return normalizeEngineResult(data.result);
}
