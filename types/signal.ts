export interface Signal {
  _id: string
  botId: string
  type: 'entry' | 'exit'
  asset: string
  price: number
  timestamp: Date
  reason: string
  confidence?: number
  strength: 'weak' | 'moderate' | 'strong'
  timeframe: string
  indicators: {
    name: string
    value: number
    threshold: number
  }[]
  metadata?: Record<string, any>
}