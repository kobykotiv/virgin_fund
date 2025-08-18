// In-memory cache fallback (replaces MongoDB-backed MarketDataCache)
const inMemoryCache: Record<string, { data: any; expiresAt: number; timestamp?: number; lastUpdated?: Date }> = {}

class MarketDataCacheService {
  private alpaca: any | null = null;

  constructor() {
    // Initialize Alpaca client if credentials are available in env (server) or localStorage (browser)
    if (typeof window !== 'undefined') {
      const apiKey = localStorage.getItem('alpaca_api_key');
      const apiSecret = localStorage.getItem('alpaca_secret_key');
      if (apiKey && apiSecret) {
        // Lazy: use fetch-based proxy via app/api/alpaca-proxy instead of Alpaca SDK when running in browser
        this.alpaca = { initialized: true };
      }
    }
  }

  public isInitialized(): boolean {
    return this.alpaca !== null;
  }

  private async getFromMemory(key: string) {
    const now = Date.now();
    const entry = inMemoryCache[key];
    if (entry && entry.expiresAt > now) return entry.data;
    return null;
  }

  private async setMemory(key: string, data: any, ttlMs: number) {
    const now = Date.now();
    inMemoryCache[key] = { data, expiresAt: now + ttlMs, timestamp: now, lastUpdated: new Date() };
  }

  public async getData<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    const cached = await this.getFromMemory(key);
    if (cached) return cached as T;

    const data = await fetchFn();
    await this.setMemory(key, data, 10 * 60 * 1000);
    return data;
  }

  public async clearCache(key?: string): Promise<void> {
    if (key) {
      delete inMemoryCache[key];
    } else {
      for (const k of Object.keys(inMemoryCache)) delete inMemoryCache[k];
    }
  }

  public async getCalendar(start: string, end: string) {
    const cacheKey = `calendar:${start}:${end}`;
    return this.getData(cacheKey, async () => {
      const res = await fetch(`/api/alpaca/auctions?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`);
      return res.json();
    });
  }

  public async getAccountActivities(activityType: string, date?: string) {
    const cacheKey = `activities:${activityType}:${date || 'all'}`;
    return this.getData(cacheKey, async () => {
      const res = await fetch(`/api/alpaca/account/activities?type=${encodeURIComponent(activityType)}&date=${encodeURIComponent(date||'')}`);
      return res.json();
    });
  }

  public async getMarketData(symbol: string, timeframe: string, start: string, end: string) {
    const cacheKey = `marketdata:${symbol}:${timeframe}:${start}:${end}`;
    return this.getData(cacheKey, async () => {
      const res = await fetch(`/api/alpaca/market?symbol=${encodeURIComponent(symbol)}&timeframe=${encodeURIComponent(timeframe)}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`);
      return res.json();
    });
  }

  public async getWatchlists() {
    const cacheKey = `watchlists:all`;
    return this.getData(cacheKey, async () => {
      const res = await fetch(`/api/alpaca/watchlists`);
      return res.json();
    });
  }

  public async createWatchlist(name: string, symbols: string[]) {
    const res = await fetch(`/api/alpaca/watchlists`, { method: 'POST', body: JSON.stringify({ name, symbols }), headers: { 'Content-Type': 'application/json' } });
    await this.clearCache('watchlists:all');
    return res.json();
  }

  public async getPortfolioHistory(timeframe: string) {
    const cacheKey = `portfolio:history:${timeframe}`;
    return this.getData(cacheKey, async () => {
      const res = await fetch(`/api/alpaca/portfolio?timeframe=${encodeURIComponent(timeframe)}`);
      return res.json();
    });
  }

  async cacheData(symbol: string, timeframe: string, data: any[]) {
    // store to in-memory cache
    const key = `cache:${symbol}:${timeframe}`;
    await this.setMemory(key, data, 24 * 60 * 60 * 1000);
  }

  async getCachedData(symbol: string, timeframe: string, maxAge: number = 3600000) {
    const key = `cache:${symbol}:${timeframe}`;
    const entry = inMemoryCache[key];
    if (!entry) return null;
    const now = Date.now();
    if (now - (entry.timestamp||0) > maxAge) return null;
    return entry.data as any[];
  }

  // Renamed duplicate method to avoid duplicate implementation error
  async clearCacheOlderThan(olderThanDays: number = 7) {
    // noop for in-memory implementation
    return;
  }
}

// Create singleton instance
export const marketDataCache = new MarketDataCacheService();
