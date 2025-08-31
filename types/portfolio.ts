export interface Trade {
  tradeId: string
  action: 'BUY' | 'SELL'
  side: 'LONG' | 'SHORT'
  quantity: number
  price: number
  datetime: string
}

export interface BasePosition {
  id: string
  assetType: 'stock' | 'crypto' | 'basket'
  ticker?: string
  quantity?: number
  avgPrice?: number
  currentPrice?: number
  trades?: Trade[]
}

export interface SinglePosition extends BasePosition {
  assetType: 'stock' | 'crypto'
  basket: null
}

export interface BasketPosition extends BasePosition {
  assetType: 'basket'
  name: string
  positions: SinglePosition[]
}

export type Position = SinglePosition | BasketPosition

export interface AllocationItem {
  name: string
  value: number
  color: string
}

export interface RiskParameters {
  maxDrawdown: number // Maximum drawdown percentage
  maxPositionSize: number // Maximum position size as percentage of portfolio
  maxDailyLoss: number // Maximum daily loss percentage
  stopLoss: number // Default stop loss percentage
  takeProfit: number // Default take profit percentage
  volatilityLimit: number // Maximum volatility threshold
}

export interface BotConnection {
  botId: string
  botName: string
  allocation: number // Percentage of portfolio allocated to this bot
  riskParameters: RiskParameters
  isActive: boolean
  lastSync: string
}

export interface Portfolio {
  id: string
  name: string
  focus: string
  icon: string
  tags: string[]
  risk: 'Low' | 'Moderate' | 'High'
  value: number
  return: number
  returnClass: string
  chartVariant: string
  allocation: AllocationItem[]
  positions: Position[]
  riskParameters: RiskParameters
  connectedBots: BotConnection[]
  createdAt: string
  updatedAt: string
}

export interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap?: number
  peRatio?: number
  dividendYield?: number
  fiftyTwoWeekHigh: number
  fiftyTwoWeekLow: number
  lastUpdated: string
}

export interface Bot {
  id: string
  name: string
  type: 'trend' | 'mean-reversion' | 'arbitrage' | 'scalping'
  status: 'active' | 'inactive' | 'error'
  strategy: string
  parameters: Record<string, any>
  performance: {
    totalReturn: number
    winRate: number
    sharpeRatio: number
    maxDrawdown: number
  }
  riskParameters: RiskParameters
  connectedPortfolios: string[]
  createdAt: string
  updatedAt: string
}

export interface RiskMetrics {
  portfolioId: string
  valueAtRisk: number
  expectedShortfall: number
  beta: number
  sharpeRatio: number
  maxDrawdown: number
  volatility: number
  correlationMatrix: Record<string, Record<string, number>>
  stressTestResults: Record<string, number>
  lastUpdated: string
}

export interface PerformanceData {
  portfolioId: string
  totalReturn: number
  annualizedReturn: number
  volatility: number
  sharpeRatio: number
  maxDrawdown: number
  alpha: number
  beta: number
  benchmarkComparison: {
    benchmark: string
    excessReturn: number
    trackingError: number
  }
  monthlyReturns: Array<{
    month: string
    return: number
  }>
  lastUpdated: string
}
