export interface MarketDataBar {
  t: string // timestamp
  o: number // open
  h: number // high
  l: number // low
  c: number // close
  v: number // volume
}

export interface NewsItem {
  id: number
  headline: string
  summary: string
  author: string
  created_at: string
  updated_at: string
  url: string
  symbols: string[]
}

export interface MarketDataConfig {
  apiKey: string
  secretKey: string
  isPaper: boolean
}
