export interface Trade {
  tradeId: string
  datetime: string
  action: 'BUY' | 'SELL'
  side: 'LONG' | 'SHORT'
  quantity: number
  price: number
}

export interface Position {
  id: string
  ticker?: string
  quantity?: number
  avgPrice?: number
  currentPrice?: number
  assetType: 'stock' | 'crypto' | 'basket'
  name?: string
  positions?: Position[]
  trades?: Trade[]
}

export interface Portfolio {
  id: string
  name: string
  totalValue: number
  cashBalance: number
  positions: Position[]
  createdAt: string
  updatedAt: string
}
