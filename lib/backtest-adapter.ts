import type {
  BacktestResult,
  TradeRecord,
  EquityPoint,
  BacktestStatistics,
} from "@/types/backtest";

/**
 * Normalize engine result into the canonical BacktestResult shape used by UI components.
 *
 * The engine result shape is permissive and may vary between providers (mock, alpaca, yahoo).
 * This adapter provides a best-effort mapping with sensible defaults so UI components can
 * consume a stable shape.
 *
 * Keep this file small and well-commented — tests should validate mapping rules.
 */

function safeNumber(v: any, fallback = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

function normalizeTrades(rawTrades: any[]): TradeRecord[] {
  if (!Array.isArray(rawTrades)) return []
  return rawTrades.map((t: any) => ({
    timestamp: t.timestamp ?? t.time ?? t.datetime ?? new Date().toISOString(),
    type: (t.type ?? t.side ?? "").toLowerCase().includes("buy") ? "buy" : "sell",
    price: safeNumber(t.price, 0),
    quantity: safeNumber(t.quantity ?? t.qty ?? t.size, 0),
    value: safeNumber(t.value ?? t.price * (t.quantity ?? t.qty ?? 0), 0),
    symbol: t.symbol ?? t.asset ?? "",
    fees: safeNumber(t.fees ?? t.fee ?? t.commission, 0),
    slippage: safeNumber(t.slippage, 0),
    executionTime: safeNumber(t.executionTime ?? t.latency ?? 0),
  }))
}

function normalizeEquity(timeseries: any[]): EquityPoint[] {
  if (!Array.isArray(timeseries)) return []
  return timeseries.map((p: any) => ({
    timestamp: p.timestamp ?? p.time ?? p.date ?? new Date().toISOString(),
    equity: safeNumber(p.equity ?? p.portfolioValue ?? p.balance ?? p.value, 0),
  }))
}

function normalizeStatistics(summary: any = {}): BacktestStatistics {
  return {
    totalTrades: safeNumber(summary.totalTrades ?? summary.trades ?? 0),
    winningTrades: safeNumber(summary.winningTrades ?? summary.wins ?? 0),
    losingTrades: safeNumber(summary.losingTrades ?? summary.losses ?? 0),
    winRate: safeNumber(summary.winRate ?? summary.win_rate ?? 0),
    averageWin: safeNumber(summary.averageWin ?? summary.avgWin ?? 0),
    averageLoss: safeNumber(summary.averageLoss ?? summary.avgLoss ?? 0),
    largestWin: safeNumber(summary.largestWin ?? summary.maxWin ?? 0),
    largestLoss: safeNumber(summary.largestLoss ?? summary.maxLoss ?? 0),
    profitFactor: safeNumber(summary.profitFactor ?? summary.profit_factor ?? 0),
    expectancy: safeNumber(summary.expectancy ?? 0),
    annualizedReturn: safeNumber(summary.annualizedReturn ?? summary.annualized_return ?? 0),
    volatility: safeNumber(summary.volatility ?? summary.vol ?? 0),
    sortinoRatio: safeNumber(summary.sortinoRatio ?? summary.sortino ?? 0),
    calmarRatio: safeNumber(summary.calmarRatio ?? summary.calmar ?? 0),
    maxConsecutiveWins: safeNumber(summary.maxConsecutiveWins ?? summary.maxWins ?? 0),
    maxConsecutiveLosses: safeNumber(summary.maxConsecutiveLosses ?? summary.maxLosses ?? 0),
    averageHoldingPeriod: safeNumber(summary.averageHoldingPeriod ?? summary.avgHolding ?? 0),
    averageDailyReturn: safeNumber(summary.averageDailyReturn ?? summary.avgDailyReturn ?? 0),
  }
}

/**
 * Convert engine result (timeseries, trades, summary, metadata) -> BacktestResult
 *
 * Expected engine result example:
 * { timeseries: [...], trades: [...], summary: { initialCapital, finalCapital, ... }, meta: { botId, botName } }
 */
export function normalizeEngineResult(engineResult: any): BacktestResult {
  const timeseries = engineResult.timeseries ?? engineResult.equity ?? engineResult.timeseries ?? []
  const trades = engineResult.trades ?? engineResult.executions ?? engineResult.orders ?? []
  const summary = engineResult.summary ?? engineResult.stats ?? engineResult.meta ?? {}

  const equityCurve = normalizeEquity(timeseries)
  const tradeRecords = normalizeTrades(trades)
  const statistics = normalizeStatistics(summary)

  // Build monthly returns if engine provides it, otherwise derive simple monthly returns placeholder
  const monthlyReturns = Array.isArray(summary.monthlyReturns)
    ? summary.monthlyReturns
    : (engineResult.monthlyReturns ?? []).map((m: any) => ({
        month: m.month ?? m.label ?? "",
        return: safeNumber(m.return ?? m.r ?? 0),
      }))

  const drawdowns = Array.isArray(engineResult.drawdowns)
    ? engineResult.drawdowns.map((d: any) => ({
        start: d.start ?? d.from,
        end: d.end ?? d.to,
        depth: safeNumber(d.depth ?? d.loss ?? 0),
        duration: safeNumber(d.duration ?? 0),
      }))
    : []

  const finalCapital = safeNumber(summary.finalCapital ?? summary.endingCapital ?? summary.portfolioValue ?? equityCurve.slice(-1)[0]?.equity ?? 0)
  const initialCapital = safeNumber(summary.initialCapital ?? summary.startingCapital ?? equityCurve[0]?.equity ?? 0)
  const totalPnL = finalCapital - initialCapital
  const pnlPercentage = initialCapital > 0 ? (totalPnL / initialCapital) * 100 : 0

  const result: BacktestResult = {
    id: (engineResult.id as string) || `bt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    botId: engineResult.botId ?? summary.botId ?? engineResult.meta?.botId ?? "",
    botName: engineResult.botName ?? summary.botName ?? engineResult.meta?.botName ?? engineResult.strategyName ?? "",
    startDate: engineResult.start ?? engineResult.startDate ?? summary.startDate ?? (equityCurve[0]?.timestamp ?? new Date().toISOString()),
    endDate: engineResult.end ?? engineResult.endDate ?? summary.endDate ?? (equityCurve.slice(-1)[0]?.timestamp ?? new Date().toISOString()),
    initialCapital,
    finalCapital,
    totalPnL,
    pnlPercentage,
    maxDrawdown: safeNumber(summary.maxDrawdown ?? summary.max_drawdown ?? 0),
    sharpeRatio: safeNumber(summary.sharpeRatio ?? summary.sharpe ?? 0),
    trades: tradeRecords,
    equityCurve,
    assetPerformance: Array.isArray(engineResult.assetPerformance) ? engineResult.assetPerformance : (summary.assetPerformance ?? []),
    statistics,
    monthlyReturns,
    drawdowns,
    optimizationResults: engineResult.optimizationResults ?? summary.optimizationResults ?? undefined,
  }

  return result
}
