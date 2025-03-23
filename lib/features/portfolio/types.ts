export interface Asset {
  id: string
  symbol: string
  quantity: number
  averagePrice: number
  currentPrice: number
}

export interface Portfolio {
  id: string
  name: string
  assets: Asset[]
  totalValue: number
  createdAt: Date
  updatedAt: Date
}
