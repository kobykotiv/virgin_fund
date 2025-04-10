export interface BacktestResult {
  returns: number[]
  positions: {
    symbol: string
    entryPrice: number
    exitPrice: number
    profit: number
    profitPercent: number
  }[]
  metrics: {
    totalReturn: number
    sharpeRatio: number
    maxDrawdown: number
    winRate: number
    profitFactor: number
  }
}

export interface BacktestOptions {
  startDate: string
  endDate: string
  initialBalance: number
  symbol: string
  strategy: {
    type: string
    params: Record<string, any>
  }
  riskSettings?: {
    stopLoss?: number
    takeProfit?: number
    positionSize?: number
  }
}