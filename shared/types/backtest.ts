/**
 * Minimal Backtest types used by the frontend backtest service.
 *
 * This file intentionally exports only the types required by
 * frontend/src/services/backtest-service.ts to satisfy the TS import.
 *
 * Expand these shapes later with more precise fields as needed.
 */

export interface IndicatorConfig {
  type: 'SMA' | 'EMA' | 'RSI' | 'MACD' | 'BB'
  params: Record<string, number>
}

export type BacktestOptions = {
  symbol: string
  startDate: Date
  endDate: Date
  timeframe: string
  indicators?: IndicatorConfig[]
  strategy: {
    type: string
    params?: Record<string, any>
  }
  initialCapital: number
}

export type BacktestResult = {
  trades: Array<Record<string, any>>
  metrics: Record<string, any>
  equity: Array<{ timestamp: Date; equity: number; drawdown: number }>
}
