import type { BacktestOptions, BacktestResult } from "../../../shared/types/backtest"
import { calculateIndicators } from "../../../lib/indicators/index"
import { getBotParams, getNumberParam } from "../../../src/lib/bot-helpers"

/**
 * Frontend backtest service (lightweight). Exposes:
 * - runBacktest(options): same shape as existing service - runs a simple backtest on provided data
 * - runBacktestForBot(bot, options): convenience wrapper that reads numeric params from bot.parameters
 *
 * Keep this file simple so it is safe to overwrite in a refactor pass.
 */

export async function runBacktest(options: BacktestOptions): Promise<BacktestResult> {
  // Fetch historical data (stubbed on frontend; server APIs do real work)
  const data = await fetchHistoricalData(options.symbol, options.startDate, options.endDate, options.timeframe)

  let enrichedData: any[] = data
  if (options.indicators?.length) {
    enrichedData = calculateIndicators(data as any[], options.indicators as any)
  }

  const trades = executeStrategy(enrichedData, options.strategy, options.initialCapital)
  const metrics = calculateMetrics(trades, options.initialCapital)
  const equity = generateEquityCurve(trades, options.initialCapital)

  return {
    trades,
    metrics,
    equity,
  }
}

/**
 * Convenience wrapper: apply bot.parameters into BacktestOptions
 * Demonstrates safe usage of src/lib/bot-helpers.
 */
export async function runBacktestForBot(bot: any, baseOptions: Partial<BacktestOptions> = {}): Promise<BacktestResult> {
  const params = getBotParams(bot as any, {})
  // Example of reading numeric param safely
  const period = getNumberParam(bot as any, "period", 14)
  const threshold = getNumberParam(bot as any, "threshold", 2)
  const initialCapital = Number(baseOptions.initialCapital ?? params.initialCapital ?? 100000)

  const options: BacktestOptions = {
    symbol: String(baseOptions.symbol ?? params.symbol ?? "AAPL"),
    startDate: baseOptions.startDate ?? new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
    endDate: baseOptions.endDate ?? new Date(),
    timeframe: String(baseOptions.timeframe ?? params.timeframe ?? "1day"),
    indicators: baseOptions.indicators ?? [],
    strategy: {
      type: "Indicator",
      params: {
        period,
        threshold,
      },
    } as any,
    initialCapital,
  }

  return runBacktest(options)
}

/* --- Internal helpers (kept intentionally simple) --- */

async function fetchHistoricalData(symbol: string, startDate: Date, endDate: Date, timeframe: string): Promise<any[]> {
  // Frontend stub: in-app demo data or empty array. Server endpoint should be used for real tests.
  return []
}

function executeStrategy(data: any[], strategy: any, initialCapital: number) {
  switch (strategy?.type) {
    case "Grid":
    case "grid":
      return executeGridStrategy(data, strategy?.params, initialCapital)
    case "DCA":
    case "dca":
      return executeDCAStrategy(data, strategy?.params, initialCapital)
    case "Indicator":
    case "indicator":
    default:
      return executeIndicatorStrategy(data, strategy?.params, initialCapital)
  }
}

function calculateMetrics(trades: any[], initialCapital: number) {
  const totalReturn = trades.reduce((sum, trade) => sum + (trade.pnl ?? 0), 0)
  const totalReturnPercent = (totalReturn / initialCapital) * 100
  const winRate = trades.length === 0 ? 0 : trades.filter(t => t.pnl > 0).length / trades.length
  const maxDrawdown = calculateMaxDrawdown(trades)
  const sharpeRatio = calculateSharpeRatio(trades)
  const profitFactor = calculateProfitFactor(trades)

  return {
    totalReturn,
    totalReturnPercent,
    maxDrawdown,
    maxDrawdownPercent: maxDrawdown * 100,
    sharpeRatio,
    winRate,
    profitFactor,
    totalTrades: trades.length,
  }
}

function calculateProfitFactor(trades: any[]) {
  const profits = trades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0)
  const losses = Math.abs(trades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0))
  return losses === 0 ? profits : profits / losses
}

function generateEquityCurve(trades: any[], initialCapital: number) {
  let equity = initialCapital
  let peak = initialCapital
  const curve = [{ timestamp: new Date(0), equity, drawdown: 0 }]

  trades.forEach((trade) => {
    equity += trade.pnl ?? 0
    const drawdown = Math.max(0, (peak - equity) / peak)
    if (equity > peak) peak = equity

    curve.push({
      timestamp: new Date(trade.timestamp),
      equity,
      drawdown,
    })
  })

  return curve
}

function calculateMaxDrawdown(trades: any[]) {
  let peak = 0
  let maxDrawdown = 0

  trades.forEach((trade) => {
    if ((trade.equity ?? 0) > peak) peak = trade.equity ?? peak
    if (peak === 0) return
    const drawdown = (peak - (trade.equity ?? 0)) / peak
    if (drawdown > maxDrawdown) maxDrawdown = drawdown
  })

  return maxDrawdown
}

function calculateSharpeRatio(trades: any[]) {
  if (trades.length === 0) return 0
  const returns = trades.map(t => t.profit ?? 0)
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
  const stdDev = Math.sqrt(variance)
  return stdDev === 0 ? 0 : avgReturn / stdDev
}

function executeGridStrategy(data: any[], params: any, initialCapital: number) {
  const trades: any[] = []
  const gridSize = getNumberParam(params as any, "gridSize", 0.01) || (params?.gridSize ?? 0.01)
  let capital = initialCapital

  for (let i = 1; i < data.length; i++) {
    const currentPrice = data[i].close
    const prevPrice = data[i - 1].close
    if (!currentPrice || !prevPrice) continue

    if (currentPrice < prevPrice * (1 - gridSize)) {
      const quantity = (capital * 0.1) / currentPrice
      const value = quantity * currentPrice
      trades.push({
        timestamp: new Date(data[i].timestamp),
        type: "buy" as const,
        price: currentPrice,
        quantity,
        value,
        pnl: 0,
        pnlPercent: 0,
      })
    }
  }

  return trades
}

function executeDCAStrategy(data: any[], params: any, initialCapital: number) {
  const trades: any[] = []
  const interval = getNumberParam(params as any, "interval", 30)
  const capital = initialCapital

  for (let i = 0; i < data.length; i += interval) {
    const price = data[i]?.close
    if (!price) continue
    const amount = getNumberParam(params as any, "amount", Math.max(1, capital / Math.max(1, Math.floor(data.length / interval))))
    const quantity = amount / price

    trades.push({
      timestamp: new Date(data[i].timestamp),
      type: "buy" as const,
      price,
      quantity,
      value: amount,
      pnl: 0,
      pnlPercent: 0,
    })
  }

  return trades
}

function executeIndicatorStrategy(data: any[], params: any, initialCapital: number) {
  const trades: any[] = []

  for (let i = 1; i < data.length; i++) {
    if (data[i].sma_short && data[i].sma_long) {
      if (data[i].sma_short > data[i].sma_long && data[i - 1].sma_short <= data[i - 1].sma_long) {
        const quantity = initialCapital * 0.1 / data[i].close
        trades.push({
          timestamp: new Date(data[i].timestamp),
          type: "buy" as const,
          price: data[i].close,
          quantity,
          value: quantity * data[i].close,
          pnl: 0,
          pnlPercent: 0,
        })
      }
    }
  }

  return trades
}
