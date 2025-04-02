export interface Position {
  symbol: string
  quantity: number
  avgPrice: number
  currentPrice: number
  costBasis: number
  marketValue: number
  unrealizedPnL: number
}

export interface DemoBot {
  id: string
  nickname: string
  costBasis: number
  positions: Position[]
  assets: string[]
  margin: number
  performance: number[]
  allocation: Record<string, number>
}
