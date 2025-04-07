import { MarketDataModel } from '../auth/models'

export class MarketDataCache {
  private static instance: MarketDataCache
  private cache: Map<string, any>
  private expiryTimes: Map<string, number>
  private cacheLevels = new Map<string, {
    ttl: number,
    maxSize: number
  }>()

  private constructor() {
    this.cache = new Map()
    this.expiryTimes = new Map()
    this.startCleanupInterval()
    this.initializeCacheLevels()
  }

  private initializeCacheLevels() {
    this.cacheLevels.set('realtime', { ttl: 1000, maxSize: 1000 })
    this.cacheLevels.set('intraday', { ttl: 300000, maxSize: 5000 })
    this.cacheLevels.set('daily', { ttl: 86400000, maxSize: 10000 })
  }

  static getInstance(): MarketDataCache {
    if (!MarketDataCache.instance) {
      MarketDataCache.instance = new MarketDataCache()
    }
    return MarketDataCache.instance
  }

  async get(key: string): Promise<any | null> {
    if (this.isExpired(key)) {
      this.cache.delete(key)
      this.expiryTimes.delete(key)
      return null
    }
    return this.cache.get(key) || null
  }

  async set(key: string, data: any): Promise<void> {
    const level = await this.getCacheLevel(key)
    const { ttl, maxSize } = this.cacheLevels.get(level) || this.cacheLevels.get('daily')!
    
    await this.enforceCacheLimit(level, maxSize)
    await this.set(key, data, ttl)
    
    // Persist to database
    await MarketDataModel.findOneAndUpdate(
      { cacheKey: key },
      { 
        data,
        expiresAt: new Date(Date.now() + ttl)
      },
      { upsert: true }
    )
  }

  private async getCacheLevel(key: string): Promise<string> {
    const parts = key.split(':')
    const timeframe = parts[1]
    
    if (timeframe === '1m') return 'realtime'
    if (['5m', '15m', '1h'].includes(timeframe)) return 'intraday'
    return 'daily'
  }

  private async enforceCacheLimit(level: string, maxSize: number): Promise<void> {
    // Implementation
  }

  private isExpired(key: string): boolean {
    const expiryTime = this.expiryTimes.get(key)
    return expiryTime ? Date.now() > expiryTime : true
  }

  private startCleanupInterval(): void {
    setInterval(() => {
      for (const [key] of this.cache) {
        if (this.isExpired(key)) {
          this.cache.delete(key)
          this.expiryTimes.delete(key)
        }
      }
    }, 60000) // Clean up every minute
  }

  private async loadPersistedCache(): Promise<void> {
    // ...existing code...
  }

  // Add advanced caching strategies
  async prefetchRelatedData(symbol: string): Promise<void> {
    // Prefetch correlated assets
    const correlatedSymbols = await this.findCorrelatedSymbols(symbol)
    await this.prefetchSymbols(correlatedSymbols)
  }

  private async findCorrelatedSymbols(symbol: string): Promise<string[]> {
    // Implement correlation logic
    return []
  }

  async invalidateRelatedData(symbol: string): Promise<void> {
    const correlatedSymbols = await this.findCorrelatedSymbols(symbol)
    await Promise.all(
      correlatedSymbols.map(sym => this.invalidateCache(sym))
    )
  }

  async warmupCache(symbols: string[]): Promise<void> {
    const timeframes = ['1Min', '5Min', '15Min', '1Hour', '1Day']
    await Promise.all(
      symbols.flatMap(symbol =>
        timeframes.map(timeframe =>
          this.prefetchData(symbol, timeframe)
        )
      )
    )
  }

  async optimizeCacheSize(): Promise<void> {
    const maxCacheSize = 1000 // Configurable
    if (MarketDataCacheService.cache.size > maxCacheSize) {
      // LRU implementation
      const entries = Array.from(MarketDataCacheService.cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp)
      
      const toRemove = entries.slice(0, entries.length - maxCacheSize)
      toRemove.forEach(([key]) => MarketDataCacheService.cache.delete(key))
    }
  }
}
