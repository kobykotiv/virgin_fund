export type BotType = 'grid' | 'dca' | 'momentum' | 'trend' | 'custom'

export type BotStatus = 'active' | 'paused' | 'error'

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
  dailyPnL?: number
  dailyReturn?: number
  trades?: {
    timestamp: string
    type: 'buy' | 'sell'
    price: number
    quantity: number
    pnl?: number
  }[]
}

export interface Bot {
  id: string
  name: string
  type: BotType
  status: BotStatus
  assets: string[]
  createdAt: string
  updatedAt: string
  settings: Record<string, any>
  indicatorConfig?: IndicatorConfig
  gridConfig?: GridConfig
  dcaConfig?: DCAConfig
  basketConfig?: BasketConfig
  performance?: BotPerformance
  riskSettings?: {
    maxDrawdown: number
    stopLoss: number
    takeProfit: number
    positionSize: number
    maxPositions: number
    enableEmergencyStop: boolean
    volatilityAdjustment: boolean
  }
}

export interface BotWithPortfolio extends Bot {
  portfolio?: any[]
  performance?: {
    totalValue: number
    totalPnL: number
    pnlPercentage: number
    totalTrades: number
    winRate: number
    lastUpdated: string
  }
}

