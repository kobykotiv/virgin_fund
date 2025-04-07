import { cache } from 'react'
import WebSocket from 'ws'

export class MarketDataService {
  private baseUrl: string
  private headers: HeadersInit
  private ws: WebSocket | null = null
  private wsClient: WebSocket | null = null
  private subscriptions = new Map<string, Set<(data: any) => void>>()
  private reconnectAttempts = 0
  private readonly maxReconnectAttempts = 5
  private lastRequestTime: number = 0
  private readonly minRequestInterval = 200 // ms
  private streamMultiplexer = new Map<string, Set<(data: any) => void>>()
  private providers: Map<string, any> = new Map()
  
  constructor(apiKey: string, secretKey: string, isPaper: boolean = true) {
    this.baseUrl = isPaper ? 
      'https://paper-api.alpaca.markets' : 
      'https://api.alpaca.markets'
      
    this.headers = {
      'APCA-API-KEY-ID': apiKey,
      'APCA-API-SECRET-KEY': secretKey,
      'Content-Type': 'application/json'
    }
  }

  // Fetch real-time market quote
  @cache
  async getQuote(symbol: string): Promise<MarketQuote> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v2/stocks/${symbol}/quote`,
        { headers: this.headers }
      )
      
      if (!response.ok) {
        throw new Error(`Failed to fetch quote for ${symbol}`)
      }

      const data = await response.json()
      return {
        symbol,
        price: data.last.price,
        change: data.last.price - data.last.close,
        changePercent: ((data.last.price - data.last.close) / data.last.close) * 100,
        volume: data.last.volume,
        lastUpdated: new Date(data.last.timestamp)
      }
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error)
      return this.generateFallbackQuote(symbol)
    }
  }

  // Fetch historical bars
  async getHistoricalBars(
    symbol: string, 
    timeframe: string,
    start: string,
    end: string
  ): Promise<any[]> {
    try {
      const url = new URL(`${this.baseUrl}/v2/stocks/${symbol}/bars`)
      url.searchParams.append('timeframe', timeframe)
      url.searchParams.append('start', start)
      url.searchParams.append('end', end)
      
      const response = await fetch(url.toString(), { headers: this.headers })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch historical data for ${symbol}`)
      }

      const data = await response.json()
      return data.bars || []
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error)
      return this.generateFallbackBars(start, end)
    }
  }

  // Initialize WebSocket connection for real-time data
  initializeStream(symbols: string[], callback: (data: any) => void): void {
    const wsUrl = this.baseUrl.replace('https', 'wss') + '/stream'
    this.ws = new WebSocket(wsUrl)

    this.ws.on('open', () => {
      if (!this.ws) return
      
      // Authenticate
      this.ws.send(JSON.stringify({
        action: 'auth',
        key: this.headers['APCA-API-KEY-ID'],
        secret: this.headers['APCA-API-SECRET-KEY']
      }))

      // Subscribe to trades
      this.ws.send(JSON.stringify({
        action: 'subscribe',
        trades: symbols,
        quotes: symbols,
        bars: symbols
      }))
    })

    this.ws.on('message', (data: Buffer) => {
      const message = JSON.parse(data.toString())
      callback(message)
    })

    this.ws.on('error', (error) => {
      console.error('WebSocket error:', error)
    })
  }

  // Close WebSocket connection
  closeStream(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  // Generate fallback data for error cases
  private generateFallbackQuote(symbol: string): MarketQuote {
    return {
      symbol,
      price: 0,
      change: 0,
      changePercent: 0,
      lastUpdated: new Date()
    }
  }

  private generateFallbackBars(start: string, end: string): any[] {
    // ...existing code...
  }

  async getLatestTrade(symbol: string): Promise<any> {
    return this.retryOperation(async () => {
      const response = await fetch(
        `${this.baseUrl}/v2/stocks/${symbol}/trades/latest`,
        { headers: this.headers }
      )
      return this.normalizeTradeData(await this.handleResponse(response))
    })
  }

  async getLatestQuote(symbol: string): Promise<any> {
    return this.retryOperation(async () => {
      const response = await fetch(
        `${this.baseUrl}/v2/stocks/${symbol}/quotes/latest`,
        { headers: this.headers }
      )
      return this.normalizeQuoteData(await this.handleResponse(response))
    })
  }

  async getSnapshot(symbol: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/v2/stocks/${symbol}/snapshot`,
      { headers: this.headers }
    )
    return this.handleResponse(response)
  }

  initializeWebSocket() {
    if (this.wsClient) return

    const wsUrl = this.baseUrl.replace('https', 'wss') + '/stream'
    this.wsClient = new WebSocket(wsUrl)

    this.wsClient.onopen = this.handleWsOpen.bind(this)
    this.wsClient.onmessage = this.handleWsMessage.bind(this)
    this.wsClient.onclose = this.handleWsClose.bind(this)
    this.wsClient.onerror = this.handleWsError.bind(this)
  }

  private async handleWsOpen() {
    if (!this.wsClient) return

    try {
      // Authenticate
      await this.wsClient.send(JSON.stringify({
        action: 'auth',
        key: this.headers['APCA-API-KEY-ID'],
        secret: this.headers['APCA-API-SECRET-KEY']
      }))

      // Resubscribe to all active subscriptions
      for (const [channel, symbols] of this.subscriptions.entries()) {
        if (symbols.size > 0) {
          await this.wsClient.send(JSON.stringify({
            action: 'subscribe',
            [channel]: Array.from(symbols)
          }))
        }
      }

      this.reconnectAttempts = 0
    } catch (error) {
      console.error('WebSocket initialization error:', error)
    }
  }

  private handleWsMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data.toString())
      // Handle different message types
      if (Array.isArray(data)) {
        data.forEach(msg => {
          this.handleStreamMessage(msg)
        })
      } else {
        this.handleStreamMessage(data)
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error)
    }
  }

  private handleStreamMessage(msg: any) {
    const handlers = this.subscriptions.get(msg.stream)
    if (handlers) {
      handlers.forEach(handler => handler(msg))
    }
  }

  private handleWsError(error: any): void {
    console.error('WebSocket error:', error)
    if (this.wsClient?.readyState === WebSocket.CLOSED) {
      this.reconnectWebSocket()
    }
  }

  private handleWsClose() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => this.initializeWebSocket(), 1000 * Math.pow(2, this.reconnectAttempts))
    }
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded')
      }
      throw new Error(`API error: ${response.statusText}`)
    }
    return await response.json()
  }

  // Helper methods for rate limiting
  private async rateLimit() {
    const now = Date.now()
    const elapsed = now - this.lastRequestTime
    if (elapsed < this.minRequestInterval) {
      await new Promise(resolve => setTimeout(resolve, this.minRequestInterval - elapsed))
    }
    this.lastRequestTime = Date.now()
  }

  // Options Data Methods
  async getOptionsChain(symbol: string): Promise<any> {
    const response = await this.retryOperation(() => fetch(
      `${this.baseUrl}/v2/stocks/${symbol}/options`,
      { headers: this.headers }
    ))
    return this.normalizeOptionsData(await response.json())
  }

  async getOptionQuote(symbol: string, expiration: string, strike: number, type: 'call' | 'put'): Promise<any> {
    const optionSymbol = `${symbol}${expiration}${strike}${type[0].toUpperCase()}`
    const response = await this.retryOperation(() => fetch(
      `${this.baseUrl}/v2/options/${optionSymbol}/quote`,
      { headers: this.headers }
    ))
    return this.normalizeOptionQuote(await response.json())
  }

  // Crypto Data Methods
  async getCryptoQuote(symbol: string): Promise<any> {
    const response = await this.retryOperation(() => fetch(
      `${this.baseUrl}/v2/crypto/${symbol}/quote`,
      { headers: this.headers }
    ))
    return this.normalizeCryptoData(await response.json())
  }

  // Multiplexed Streaming
  subscribeToStream(channel: string, symbols: string[], callback: (data: any) => void): void {
    const key = `${channel}:${symbols.join(',')}`
    if (!this.streamMultiplexer.has(key)) {
      this.streamMultiplexer.set(key, new Set())
      this.initializeStreamForSymbols(channel, symbols)
    }
    this.streamMultiplexer.get(key)?.add(callback)
  }

  private async initializeStreamForSymbols(channel: string, symbols: string[]): Promise<void> {
    if (!this.wsClient) this.initializeWebSocket()
    await this.wsClient?.send(JSON.stringify({
      action: 'subscribe',
      [channel]: symbols
    }))
  }

  // Retry Strategy
  private async retryOperation<T>(
    operation: () => Promise<T>, 
    maxRetries: number = 3, 
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error | null = null
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)))
          continue
        }
      }
    }
    throw lastError
  }

  // Data Normalization
  private normalizeOptionsData(data: any): any {
    return {
      symbol: data.symbol,
      expirations: data.expirations,
      strikes: data.strikes.sort((a: number, b: number) => a - b),
      options: data.options.map((opt: any) => ({
        strike: opt.strike_price,
        expiration: new Date(opt.expiration_date),
        type: opt.option_type,
        bid: opt.bid,
        ask: opt.ask,
        volume: opt.volume,
        openInterest: opt.open_interest,
        delta: opt.greeks?.delta,
        gamma: opt.greeks?.gamma,
        theta: opt.greeks?.theta,
        vega: opt.greeks?.vega
      }))
    }
  }

  private normalizeCryptoData(data: any): any {
    return {
      symbol: data.symbol,
      price: data.price,
      volume: data.volume,
      timestamp: new Date(data.timestamp),
      exchange: data.exchange,
      bid: data.bid,
      ask: data.ask,
      bidSize: data.bidSize,
      askSize: data.askSize
    }
  }

  private normalizeOptionQuote(data: any): any {
    return {
      symbol: data.symbol,
      bid: data.bid,
      ask: data.ask,
      last: data.last,
      volume: data.volume,
      openInterest: data.open_interest,
      underlyingPrice: data.underlying_price,
      impliedVolatility: data.implied_volatility,
      delta: data.greeks?.delta,
      gamma: data.greeks?.gamma,
      theta: data.greeks?.theta,
      vega: data.greeks?.vega,
      timestamp: new Date(data.timestamp)
    }
  }

  private normalizeTradeData(data: any): any {
    return {
      symbol: data.symbol,
      price: data.price,
      size: data.size,
      timestamp: new Date(data.timestamp),
      exchange: data.exchange
    }
  }

  private normalizeQuoteData(data: any): any {
    return {
      symbol: data.symbol,
      bidPrice: data.bidPrice,
      bidSize: data.bidSize,
      askPrice: data.askPrice,
      askSize: data.askSize,
      timestamp: new Date(data.timestamp)
    }
  }

  private async reconnectWebSocket(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      throw new Error('Max reconnection attempts reached')
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, this.reconnectAttempts)))
    this.initializeWebSocket()
  }

  // WebSocket methods
  initializeWebSocket(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return

    const wsUrl = this.baseUrl.replace('https', 'wss') + '/stream'
    this.ws = new WebSocket(wsUrl)

    this.ws.onopen = this.handleWsOpen.bind(this)
    this.ws.onmessage = this.handleWsMessage.bind(this)
    this.ws.onerror = this.handleWsError.bind(this)
    this.ws.onclose = this.handleWsClose.bind(this)
  }

  private handleWsOpen(): void {
    if (!this.ws) return
    
    this.ws.send(JSON.stringify({
      action: 'auth',
      key: this.headers['APCA-API-KEY-ID'],
      secret: this.headers['APCA-API-SECRET-KEY']
    }))
  }

  private handleWsMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data.toString())
      // Handle different message types and emit events
      this.processStreamData(data)
    } catch (error) {
      console.error('WebSocket message error:', error)
    }
  }

  private processStreamData(data: any): void {
    if (Array.isArray(data)) {
      data.forEach(msg => {
        switch (msg.T) {
          case 't': // Trade
            this.emit('trade', this.normalizeTradeData(msg))
            break
          case 'q': // Quote
            this.emit('quote', this.normalizeQuoteData(msg))
            break
          case 'b': // Bar
            this.emit('bar', this.normalizeBarData(msg))
            break
        }
      })
    }
  }

  private normalizeBarData(data: any): any {
    return {
      symbol: data.S,
      open: data.o,
      high: data.h,
      low: data.l,
      close: data.c,
      volume: data.v,
      timestamp: new Date(data.t)
    }
  }

  private emit(event: string, data: any): void {
    // Implement event emission logic
  }

  registerProvider(name: string, provider: any): void {
    this.providers.set(name, provider)
  }

  async getDataFromProvider(
    provider: string, 
    symbol: string, 
    timeframe: string
  ): Promise<any> {
    const dataProvider = this.providers.get(provider)
    if (!dataProvider) {
      throw new Error(`Provider ${provider} not found`)
    }

    try {
      const data = await dataProvider.fetchData(symbol, timeframe)
      return this.normalizeProviderData(data, provider)
    } catch (error) {
      console.error(`Error fetching data from ${provider}:`, error)
      throw error
    }
  }

  private normalizeProviderData(data: any, provider: string): any {
    // Normalize data to common format
    const normalizers = {
      alpaca: this.normalizeAlpacaData,
      polygon: this.normalizePolygonData,
      iex: this.normalizeIEXData
    }

    const normalizer = normalizers[provider as keyof typeof normalizers]
    return normalizer ? normalizer(data) : data
  }

  private normalizeAlpacaData(data: any): any {
    // ...existing code...
  }

  private normalizeAssetData(data: any): any {
    return {
      symbol: data.symbol,
      name: data.name,
      type: data.type,
      price: data.price,
      icon: this.getAssetIcon(data.symbol, data.type),
      // ...existing code...
    }
  }

  private async getAssetIcon(symbol: string, type: string): Promise<string> {
    return IconUtils.getAssetIcon(symbol, type)
  }
}

// Types
export interface MarketQuote {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume?: number
  lastUpdated: Date
}
