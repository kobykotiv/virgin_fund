import { MarketDataBar, NewsItem } from '@/types/market'

export class MarketDataService {
  private baseUrl: string
  private apiKey: string
  private secretKey: string
  
  constructor(apiKey: string, secretKey: string, isPaper: boolean = true) {
    this.apiKey = apiKey
    this.secretKey = secretKey
    this.baseUrl = isPaper ? 
      'https://paper-api.alpaca.markets' : 
      'https://api.alpaca.markets'
  }

  private async fetch(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'APCA-API-KEY-ID': this.apiKey,
        'APCA-API-SECRET-KEY': this.secretKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    return response.json()
  }

  // Enhanced API methods for comprehensive market data and trading operations
  
  // Account information
  async getAccount() {
    return this.fetch('/v2/account')
  }
  
  // Portfolio positions
  async getPositions() {
    return this.fetch('/v2/positions')
  }
  
  // Order management
  async getOrders(status = 'open') {
    return this.fetch(`/v2/orders?status=${status}`)
  }
  
  async placeOrder(orderParams: {
    symbol: string;
    qty: number;
    side: 'buy' | 'sell';
    type: 'market' | 'limit' | 'stop' | 'stop_limit';
    time_in_force: 'day' | 'gtc' | 'ioc' | 'fok';
    limit_price?: number;
    stop_price?: number;
  }) {
    return this.fetch('/v2/orders', {
      method: 'POST',
      body: JSON.stringify(orderParams)
    })
  }
  
  async cancelOrder(orderId: string) {
    return this.fetch(`/v2/orders/${orderId}`, {
      method: 'DELETE'
    })
  }
  
  // Enhanced market data methods
  async getHistoricalBars(symbol: string, timeframe: string, start: string, end: string): Promise<MarketDataBar[]> {
    return this.fetch(`/v2/stocks/${symbol}/bars?timeframe=${timeframe}&start=${start}&end=${end}`)
  }
  
  async getMultipleSymbolBars(symbols: string[], timeframe: string, start: string, end: string) {
    // For fetching data for multiple symbols in one request
    const symbolsQuery = symbols.join(',')
    return this.fetch(`/v2/stocks/bars?symbols=${symbolsQuery}&timeframe=${timeframe}&start=${start}&end=${end}`)
  }
  
  async getSnapshot(symbols: string[]) {
    // Get latest market snapshot for multiple symbols
    const symbolsQuery = symbols.join(',')
    return this.fetch(`/v2/stocks/snapshots?symbols=${symbolsQuery}`)
  }
  
  // Calendar and market hours
  async getCalendar(start?: string, end?: string) {
    let endpoint = '/v2/calendar'
    if (start && end) {
      endpoint += `?start=${start}&end=${end}`
    }
    return this.fetch(endpoint)
  }
  
  async getClock() {
    return this.fetch('/v2/clock')
  }
  
  // Assets information
  async getAssets(status = 'active', assetClass = 'us_equity') {
    return this.fetch(`/v2/assets?status=${status}&asset_class=${assetClass}`)
  }

  async getNews(symbols?: string[]): Promise<NewsItem[]> {
    const symbolsQuery = symbols ? `?symbols=${symbols.join(',')}` : ''
    return this.fetch(`/v2/news${symbolsQuery}`)
  }

  // Initialize WebSocket connection for real-time data
  initializeWebSocket() {
    const ws = new WebSocket('wss://stream.data.alpaca.markets/v2/iex')
    
    ws.onopen = () => {
      ws.send(JSON.stringify({
        action: 'auth',
        key: this.apiKey,
        secret: this.secretKey
      }))
    }

    return ws
  }
  
  // Configure WebSocket for specific data streams
  subscribeToStream(ws: WebSocket, streams: string[]) {
    ws.send(JSON.stringify({
      action: 'subscribe',
      trades: streams.map(symbol => `T.${symbol}`),
      quotes: streams.map(symbol => `Q.${symbol}`),
      bars: streams.map(symbol => `AM.${symbol}`)
    }))
  }
}
