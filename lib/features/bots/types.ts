export interface TradingBot {
  id: string
  name: string
  strategy: string
  assets: string[]
  active: boolean
  params: {
    interval: string
    riskLevel: number
    maxPositions: number
  }
}
