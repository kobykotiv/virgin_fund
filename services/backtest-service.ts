import { calculateIndicators } from "@/lib/indicators"
import type {
  BacktestResult,
  BacktestStatistics,
  TradeRecord,
  EquityPoint,
  AssetPerformance,
  Drawdown,
} from "@/types/backtest"

/**
 * Lightweight backtest service — conservative stubs that return the canonical
 * BacktestResult shape so callers and type-checking align with `types/backtest.ts`.
 *
 * These implementations are intentionally minimal and must be replaced with
 * production-grade logic later. The goal here is to satisfy TypeScript and
 * unblock UI / tests.
 */

/**
 * Run a backtest and return a BacktestResult-compatible payload.
 * Accepts a permissive options object to avoid coupling to other internal types.
 */
export async function runBacktest(options: any): Promise<BacktestResult> {
  const initialCapital: number = typeof options?.initialCapital === "number" ? options.initialCapital : 10000
  // Placeholder for historical data; callers should replace with real fetch.
  const data: any[] = await fetchHistoricalData(options?.symbol, options?.startDate, options?.endDate, options?.timeframe)

  // Enrich with indicators when provided (safe, idempotent)
  let enrichedData = data
  if (options?.indicators && Array.isArray(options.indicators) && options.indicators.length) {
    try {
      enrichedData = calculateIndicators(data, options.indicators)
    } catch {
      // swallow errors in the permissive stub path to remain resilient
      enrichedData = data
    }
  }

  // Execute strategy (stubbed implementations return empty trades array currently)
  const trades: TradeRecord[] = executeStrategy(enrichedData, options?.strategy, initialCapital)

  // Compute metrics and equity curve compatible with canonical types
  const metrics = calculateMetrics(trades, initialCapital)
  const equity = generateEquityCurve(trades, initialCapital)

  // Compose canonical BacktestResult
  const result: BacktestResult = {
    id: `bt-${Date.now()}`,
    botId: options?.botId ?? options?.botId ?? "unknown",
    botName: options?.botName ?? "backtest",
    startDate: options?.startDate ?? new Date().toISOString(),
    endDate: options?.endDate ?? new Date().toISOString(),
    initialCapital,
    finalCapital: metrics.finalCapital,
    totalPnL: metrics.totalPnL,
    pnlPercentage: metrics.pnlPercentage,
    maxDrawdown: metrics.maxDrawdown,
    sharpeRatio: metrics.sharpeRatio,
    trades,
    equityCurve: equity,
    assetPerformance: [] as AssetPerformance[],
    statistics: metrics.statistics,
    monthlyReturns: [],
    drawdowns: [] as Drawdown[],
    optimizationResults: [],
  }

  return result
}

/* ---------------------
   Helper stubs
   --------------------- */

async function fetchHistoricalData(symbol: string | undefined, startDate: string | undefined, endDate: string | undefined, timeframe: string | undefined) {
  // Intentionally minimal — replace with provider adapter (Alpaca/Yahoo/Mock) later.
  return []
}

function executeStrategy(data: any[], strategy: any, initialCapital: number): TradeRecord[] {
  const strategyType = strategy?.type ?? strategy?.name ?? "unknown"
  switch (strategyType) {
    case "Grid":
      return executeGridStrategy(data, strategy?.params, initialCapital)
    case "DCA":
      return executeDCAStrategy(data, strategy?.params, initialCapital)
    case "Indicator":
      return executeIndicatorStrategy(data, strategy?.params, initialCapital)
    default:
      // Unknown strategy -> no trades
      return []
  }
}

function executeGridStrategy(data: any[], params: any, initialCapital: number): TradeRecord[] {
  if (!Array.isArray(data) || data.length === 0) return []

  const firstPoint = data[0] ?? {}
  const lastPoint = data[data.length - 1] ?? {}
  const firstPrice = Number(firstPoint.close ?? firstPoint.price ?? 0)
  const lastPrice = Number((lastPoint.close ?? lastPoint.price ?? firstPrice) || 1)

  const qty = Math.max(Math.floor(initialCapital / (firstPrice || 1)), 0)
  if (qty === 0) return []

  const buy: TradeRecord = {
    timestamp: new Date().toISOString(),
    type: "buy",
    price: firstPrice,
    quantity: qty,
    value: -firstPrice * qty,
    symbol: params?.symbol ?? "UNKNOWN",
  }

  const sell: TradeRecord = {
    timestamp: new Date().toISOString(),
    type: "sell",
    price: lastPrice,
    quantity: qty,
    value: lastPrice * qty,
    symbol: params?.symbol ?? "UNKNOWN",
  }

  return [buy, sell]
}

function executeDCAStrategy(data: any[], params: any, initialCapital: number): TradeRecord[] {
  if (!Array.isArray(data) || data.length === 0) return []

  // Simple DCA placeholder: spread 3 purchases evenly across the series
  const purchases = Math.min(3, data.length)
  const perPurchase = Math.floor(initialCapital / purchases)
  const trades: TradeRecord[] = []

  for (let i = 0; i < purchases; i++) {
    const idx = Math.floor((i / purchases) * (data.length - 1))
    const point = data[idx] ?? {}
    const price = Number(point.close ?? point.price ?? 0)
    const qty = price > 0 ? Math.max(Math.floor(perPurchase / price), 0) : 0
    if (qty === 0) continue

    trades.push({
      timestamp: new Date().toISOString(),
      type: "buy",
      price,
      quantity: qty,
      value: -price * qty,
      symbol: params?.symbol ?? "UNKNOWN",
    })
  }

  return trades
}

function executeIndicatorStrategy(data: any[], params: any, initialCapital: number): TradeRecord[] {
  // Minimal indicator-based placeholder: enter at first close, exit at last close.
  if (!Array.isArray(data) || data.length === 0) return []

  const first = data[0] ?? {}
  const last = data[data.length - 1] ?? {}
  const entryPrice = Number(first.close ?? first.price ?? 0)
  const exitPrice = Number(last.close ?? last.price ?? entryPrice)

  const qty = entryPrice > 0 ? Math.max(Math.floor(initialCapital / entryPrice), 0) : 0
  if (qty === 0) return []

  const entry: TradeRecord = {
    timestamp: new Date().toISOString(),
    type: "buy",
    price: entryPrice,
    quantity: qty,
    value: -entryPrice * qty,
    symbol: params?.symbol ?? "UNKNOWN",
  }

  const exit: TradeRecord = {
    timestamp: new Date().toISOString(),
    type: "sell",
    price: exitPrice,
    quantity: qty,
    value: exitPrice * qty,
    symbol: params?.symbol ?? "UNKNOWN",
  }

  return [entry, exit]
}

/**
 * Minimal metrics calculator that returns a permissive BacktestStatistics object.
 * Fields are filled with safe defaults derived from trades where possible.
 */
function calculateMetrics(trades: TradeRecord[], initialCapital: number) {
  const finalCapital = trades.length ? computeFinalCapitalFromTrades(trades, initialCapital) : initialCapital
  const totalPnL = finalCapital - initialCapital
  const pnlPercentage = initialCapital > 0 ? (totalPnL / initialCapital) * 100 : 0
  const maxDrawdown = 0
  const sharpeRatio = 0

  const statistics: Partial<BacktestStatistics> = {
    totalTrades: trades.length,
    winningTrades: trades.filter((t) => t.type === "sell").length,
    losingTrades: trades.filter((t) => t.type === "buy").length,
    winRate: trades.length ? (trades.filter((t) => t.type === "sell").length / trades.length) * 100 : 0,
    averageWin: 0,
    averageLoss: 0,
    largestWin: 0,
    largestLoss: 0,
    profitFactor: 0,
    expectancy: 0,
    annualizedReturn: 0,
    volatility: 0,
    sortinoRatio: 0,
    calmarRatio: 0,
    maxConsecutiveWins: 0,
    maxConsecutiveLosses: 0,
    averageHoldingPeriod: 0,
    averageDailyReturn: 0,
  }

  return {
    finalCapital,
    totalPnL,
    pnlPercentage,
    maxDrawdown,
    sharpeRatio,
    statistics: statistics as BacktestStatistics,
  }
}

function computeFinalCapitalFromTrades(trades: TradeRecord[], initialCapital: number) {
  // Naive placeholder: assume trades[].value are P&L contributions (signed)
  const pnl = trades.reduce((acc, t) => acc + (typeof t.value === "number" ? t.value : 0), 0)
  return initialCapital + pnl
}

/**
 * Generate a minimal equity curve compatible with EquityPoint[]
 */
function generateEquityCurve(trades: TradeRecord[], initialCapital: number): EquityPoint[] {
  // Simple, single-point equity curve. Replace with time-series generation later.
  return [{ timestamp: new Date().toISOString(), equity: initialCapital }]
}
