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

  // Additional properties used in components
  strategy?: string
  parameters?: Record<string, any>
}

// Alias for backward compatibility
export type TradingBot = Bot

// Bot configuration type
export type BotConfig = IndicatorConfig | GridConfig | DCAConfig | BasketConfig

// Strategy types
export type StrategyType = BotType

// Position type
export interface Position {
  symbol: string
  quantity: number
  avgPrice: number
  currentPrice: number
  pnl: number
  pnlPercent: number
}

// Trade type
export interface Trade {
  id: string
  symbol: string
  side: 'buy' | 'sell'
  quantity: number
  price: number
  timestamp: string
  pnl?: number
  // Additional properties used in components
  date: string
  action: 'BUY' | 'SELL'
}

// Order type
export interface Order {
  id: string
  symbol: string
  side: 'buy' | 'sell'
  type: 'market' | 'limit' | 'stop' | 'stop_limit'
  quantity: number
  price?: number
  status: 'pending' | 'filled' | 'cancelled' | 'rejected'
  timestamp: string
}

// Backtest result type
export interface BacktestResult {
  totalReturn: number
  winRate: number
  maxDrawdown: number
  sharpeRatio: number
  totalTrades: number
  trades: Trade[]
  // Additional property used in components
  initialCapital: number
}
