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

export interface Portfolio {
  [x: string]: number
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
}
