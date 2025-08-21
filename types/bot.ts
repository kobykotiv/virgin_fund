export type BotType =
  | "basket" // Basket Trading
  | "grid" // Grid Trading
  | "dca" // Dollar Cost Averaging
  | "indicator" // Indicator-Based Trading

export type BotStatus =
  | "active" // Bot is running
  | "paused" // Bot is paused
  | "error" // Bot has encountered an error

export type Timeframe = "1min" | "5min" | "15min" | "30min" | "1hour" | "2hour" | "4hour" | "1day" | "1week" | "1month"

export interface IndicatorConfig {
  type: "rsi" | "macd" | "bollinger"
  timeframe: Timeframe
  entryThreshold: number
  exitThreshold: number
}

export interface GridConfig {
  gridSize: number // Grid size in percentage (e.g. 1 for 1%)
  upperLimit: number // Upper price limit
  lowerLimit: number // Lower price limit
  quantity: number // Quantity per order
}

export interface DCAConfig {
  interval: string // Cron expression for scheduling
  amount: number // Amount per purchase
  duration?: string // Optional duration (e.g. '30days')
}

export interface BasketConfig {
  rebalancePeriod?: string // Optional rebalance period (cron expression)
  targetAllocation: Record<string, number> // e.g. {'AAPL': 0.5, 'MSFT': 0.5}
}

export interface BotPerformance {
  totalPnL: number
  pnlPercentage: number
  totalTrades: number
  winRate: number
  lastUpdated: string
}

export interface Bot {
  id: string
  name: string
  type: BotType
  status: BotStatus
  assets: string[] // Stock symbols
  createdAt: string
  updatedAt: string
  performance?: BotPerformance
  allocation?: number // Capital allocation for the bot (for demo mode)

  // Risk management
  stopLoss?: number // Stop loss percentage
  takeProfit?: number // Take profit percentage
  maxDrawdown?: number // Maximum drawdown percentage

  // Bot-specific configs
  indicatorConfig?: IndicatorConfig
  gridConfig?: GridConfig
  dcaConfig?: DCAConfig
  basketConfig?: BasketConfig
}

// Optional metadata used across UI and services
export interface BotMetadata {
  description?: string
  lastTradeAt?: string
}

// Extend Bot with permissive runtime fields used throughout the app
export interface Bot extends BotMetadata {
  // Strategy and parameters are permissive to avoid widespread refactors
  strategy?: StrategyType
  parameters?: Record<string, any>
}

// Weak Order type used by some services
export type Order = {
  id?: string
  symbol?: string
  qty?: number
  side?: 'buy' | 'sell' | string
  type?: string
  time_in_force?: string
  filled_qty?: number
  filled_avg_price?: number
  status?: string
}

// Lightweight/compatible aliases used across the codebase.
// These are intentionally permissive to reduce type friction while
// we iteratively tidy up precise shapes in their own modules.
import type { Position as _Position } from "./portfolio"

export type TradingBot = Bot
export type BotConfig = IndicatorConfig | GridConfig | DCAConfig | BasketConfig | Record<string, any>
export type StrategyType = "meanReversion" | "momentum" | "grid" | "dca" | "indicator" | "basket" | string

export type Trade = {
  tradeId?: string
  symbol?: string
  action?: "buy" | "sell" | string
  side?: "LONG" | "SHORT" | string
  price?: number
  quantity?: number
  datetime?: string
  value?: number
}

// Re-export Position from the canonical types/portfolio.ts
export type Position = _Position | any

// Backtest result - permissive alias used in services/backtest-engine and similar
export type BacktestResult = any


