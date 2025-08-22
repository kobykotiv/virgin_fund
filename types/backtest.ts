// Canonical backtest types used across backtest-service, backtest engine, and tests.
// TODO: tighten permissive unions (dataSource, timeframe, indicator types) before Beta/Stable.

/**
 * Backtest execution parameters
 */
export interface BacktestParams {
  botId: string
  startDate: string
  endDate: string
  initialCapital: number
  slippage?: number
  commission?: number
  // Temporarily permissive to accept test/provider strings like "mock", "alpaca", "yahoo"
  dataSource?: "alpaca" | "yahoo" | "mock" | string
}

/**
 * Individual trade/execution record produced by the simulation
 */
export interface TradeRecord {
  timestamp: string
  type: "buy" | "sell"
  price: number
  quantity: number
  value: number
  symbol: string
  fees?: number
  slippage?: number
  executionTime?: number
}

/**
 * Equity point for equity curve
 */
export interface EquityPoint {
  timestamp: string
  equity: number
}

/**
 * Per-asset performance summary
 */
export interface AssetPerformance {
  symbol: string
  performance: number
}

/**
 * Drawdown window
 */
export interface Drawdown {
  start: string
  end: string
  depth: number
  duration: number
}

/**
 * Aggregated statistics produced by the backtester
 */
export interface BacktestStatistics {
  totalTrades: number
  winningTrades: number
  losingTrades: number
  winRate: number
  averageWin: number
  averageLoss: number
  largestWin: number
  largestLoss: number
  profitFactor: number
  expectancy: number
  annualizedReturn: number
  volatility: number
  sortinoRatio: number
  calmarRatio: number
  maxConsecutiveWins: number
  maxConsecutiveLosses: number
  averageHoldingPeriod: number
  averageDailyReturn: number
}

/**
 * Complete result shape returned by runBacktest
 */
export interface BacktestResult {
  id: string
  botId: string
  botName: string
  startDate: string
  endDate: string
  initialCapital: number
  finalCapital: number
  totalPnL: number
  pnlPercentage: number
  maxDrawdown: number
  sharpeRatio: number
  trades: TradeRecord[]
  equityCurve: EquityPoint[]
  assetPerformance: AssetPerformance[]
  statistics: BacktestStatistics
  monthlyReturns: { month: string; return: number }[]
  drawdowns: Drawdown[]
  optimizationResults?: { parameter: string; value: number; performance: number }[]
}
