export type BotType = "indicator" | "grid" | "dca" | "basket"
export type BotStatus = "active" | "paused" | "error" | "backtest"

export type Timeframe = "1min" | "5min" | "15min" | "30min" | "1hour" | "2hour" | "4hour" | "1day" | "1week" | "1month"

export interface IndicatorConfig {
  type: "rsi" | "macd" | "bollinger"
  timeframe: "1min" | "5min" | "15min" | "30min" | "1hour" | "4hour" | "1day" | "1week"
  entryThreshold: number
  exitThreshold: number
}

export interface GridConfig {
  gridSize: number // Percentage between grid lines
  upperLimit: number
  lowerLimit: number
  quantity: number
}

export interface DCAConfig {
  interval: string // Cron expression (e.g., "0 0 * * 1" for every Monday)
  amount: number
  duration?: string // Optional duration (e.g., "30days", "3months", "1year")
}

export interface BasketConfig {
  rebalancePeriod: string // Cron expression for rebalancing
  targetAllocation: Record<string, number> // Symbol to decimal percentage map
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
  assets: string[] // Array of trading symbols (e.g., ["AAPL", "MSFT", "BTC-USD"])
  createdAt: string
  updatedAt: string
  performance: BotPerformance
  stopLoss?: number // Optional percentage for stop loss
  takeProfit?: number // Optional percentage for take profit
  maxDrawdown?: number // Optional maximum drawdown percentage
  allocation?: number // Optional capital allocation for this bot
  indicatorConfig?: IndicatorConfig
  gridConfig?: GridConfig
  dcaConfig?: DCAConfig
  basketConfig?: BasketConfig
  // Fields for whitelabeling support
  whitelabel?: {
    enabled: boolean
    apiKey?: string
    brandName?: string
    theme?: Record<string, string>
  }
}

export interface BotValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
  suggestions: string[]
}

export interface BotQuota {
  maxBots: number
  activeBots: number
  remainingBots: number
  maxAssetsPerBot: number
  features: {
    liveTrading: boolean
    paperTrading: boolean
    indicator: boolean
    grid: boolean
    dca: boolean
    basket: boolean
  }
}

// Types for historical price data
export interface OHLCV {
  timestamp: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// Types for bot signals
export interface Signal {
  botId: string
  type: "entry" | "exit"
  asset: string
  price: number
  timestamp: string
  reason: string
  confidence?: number // Optional confidence score 0-1
  metadata?: Record<string, any> // Additional signal-specific data
}

// Types for trading rules
export interface TradingRule {
  id: string
  name: string
  description?: string
  conditions: RuleCondition[]
  actions: RuleAction[]
  enabled: boolean
}

export interface RuleCondition {
  type: "price" | "indicator" | "time" | "volume" | "custom"
  operator: ">" | "<" | ">=" | "<=" | "==" | "!="
  value: number | string
  asset?: string
  indicator?: {
    type: string
    params: Record<string, any>
  }
}

export interface RuleAction {
  type: "buy" | "sell" | "alert" | "custom"
  amount?: number | "all"
  price?: number | "market"
  asset?: string
  metadata?: Record<string, any>
}

// Types for exchange integration
export interface ExchangeCredentials {
  keyId: string
  secretKey: string
  baseUrl: string
  paper: boolean
}

// Types for platform configuration
export interface PlatformConfig {
  branding?: {
    name: string
    logo?: string
    primaryColor?: string
    secondaryColor?: string
  }
  features: {
    userAuth: boolean
    copyTrading: boolean
    backtesting: boolean
    signals: boolean
  }
  limits?: {
    maxBots: number
    maxUsers?: number
    maxAssetsPerBot?: number
    supportedExchanges: string[]
    supportedAssets: string[]
  }
}

