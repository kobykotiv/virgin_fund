import { BotType, IndicatorConfig, GridConfig, DCAConfig, BasketConfig } from './bot'

export interface Strategy {
  _id: string
  name: string
  description?: string
  type: BotType
  config: IndicatorConfig | GridConfig | DCAConfig | BasketConfig
  assets: string[]
  riskLevel: 'low' | 'medium' | 'high'
  tags: string[]
  isPublic: boolean
  createdBy: string
  createdAt: Date
  updatedAt: Date
  backtest?: {
    winRate: number
    totalTrades: number
    profit: number
    maxDrawdown: number
    sharpeRatio: number
    lastRun: Date
  }
}