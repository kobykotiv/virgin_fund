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

export type BotCondition = {
  id: string
  type: "price" | "indicator" | "time" | "volume" | "sentiment"
  indicator?: string
  operator: "above" | "below" | "crosses_above" | "crosses_below" | "between"
  value: number | [number, number]
  timeframe?: "1m" | "5m" | "15m" | "1h" | "4h" | "1d"
}

export type BotAction = {
  id: string
  type: "strategy" | "order"
  strategyId?: string
  orderType?: "market" | "limit"
  side?: "buy" | "sell"
  quantity?: number | "all"
  price?: number
}

export type BotRule = {
  id: string
  name: string
  condition: BotCondition
  action: BotAction
  priority: number
  enabled: boolean
}

export interface RiskManagementSettings {
  stopLoss: {
    type: "fixed" | "trailing" | "atr"
    value: number
    atrMultiplier?: number
    trailingOffset?: number
  }
  takeProfit: {
    type: "fixed" | "scaled"
    targets: {
      price: number
      quantity: number
    }[]
  }
  positionSizing: {
    type: "fixed" | "risk_based" | "kelly_criterion"
    value: number
    maxPositionSize: number
    maxAllocation: number
  }
  riskPerTrade: number
  maxDrawdown: number
  maxOpenPositions: number
  maxDailyLoss: number
}

// Add these new types for Alpaca integration
export interface AlpacaDeployment {
  maxCapitalPercentage: number;
  executionType: "market" | "limit";
  fractionalTrading: boolean;
  marginTrading: boolean;
  notifications: {
    trades: boolean;
    errors: boolean;
    performance: boolean;
  };
}

// Update the BotConfig type
export type BotConfig = {
  id?: string
  name: string
  description?: string
  type: BotType
  assets?: {
    symbol: string
    allocation: number
  }[]
  strategy?: {
    type: "momentum" | "meanReversion" | "trend"
    indicators?: {
      name: string
      period: number
      parameters: Record<string, any>
    }[]
  }
  riskManagement: {
    stopLoss: {
      type: "fixed" | "trailing" | "atr"
      value: number
      atrMultiplier?: number
      trailingOffset?: number
    }
    takeProfit: {
      type: "fixed" | "scaled"
      targets: {
        price: number
        quantity: number
      }[]
    }
    positionSizing: {
      type: "fixed" | "risk_based" | "kelly_criterion"
      value: number
      maxPositionSize: number
      maxAllocation: number
    }
    riskPerTrade: number
    maxDrawdown: number
    maxOpenPositions: number
    maxDailyLoss: number
  }
  deployment?: AlpacaDeployment; // New property for Alpaca settings
}

