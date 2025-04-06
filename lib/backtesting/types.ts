export type TimeFrame = '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w'

export interface BacktestOptions {
  symbol: string
  startDate: Date
  endDate: Date
  timeframe: TimeFrame
  initialCapital: number
  indicators?: IndicatorConfig[]
  strategy: StrategyConfig
}

export interface IndicatorConfig {
  type: 'SMA' | 'EMA' | 'RSI' | 'MACD' | 'BB'
  params: Record<string, number>
}

export interface StrategyConfig {
  type: 'Grid' | 'DCA' | 'Indicator' | 'MeanReversion'
  params: Record<string, any>
}

export interface BacktestResult {
  trades: BacktestTrade[]
  metrics: BacktestMetrics
  equity: EquityPoint[]
}

export interface BacktestTrade {
  timestamp: Date
  type: 'buy' | 'sell'
  price: number
  quantity: number
  value: number
  pnl: number
  pnlPercent: number
}

export interface BacktestMetrics {
  totalReturn: number
  totalReturnPercent: number
  maxDrawdown: number
  maxDrawdownPercent: number
  sharpeRatio: number
  winRate: number
  profitFactor: number
  totalTrades: number
}

export interface EquityPoint {
  timestamp: Date
  equity: number
  drawdown: number
}
