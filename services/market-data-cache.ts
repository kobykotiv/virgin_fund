import AlpacaClient from '@alpacahq/alpaca-trade-api';
import { MarketDataBar } from '@/types/market';

// In-memory cache fallback (TTL)
type CacheEntry<T> = { data: T; expiresAt: number }
const inMemoryCache: Record<string, CacheEntry<any>> = {};

// Cache configuration
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes in milliseconds

class MarketDataCacheService {
  private alpaca: AlpacaClient | null = null;

  constructor() {
    // Initialize Alpaca client if in browser environment
    if (typeof window !== 'undefined') {
      const apiKey = localStorage.getItem('alpaca_api_key');
      const apiSecret = localStorage.getItem('alpaca_secret_key');
      
      if (apiKey && apiSecret) {
        this.alpaca = new AlpacaClient({
          credentials: {
            key: apiKey,
            secret: apiSecret,
          },
          paper: true, // Use paper trading for safety
        });
      }
    }
  }

  // Check if Alpaca client is initialized
  public isInitialized(): boolean {
    return this.alpaca !== null;
  }

  // Get data from cache or fetch from API
  public async getData<T>(
    key: string, 
    fetchFn: () => Promise<T>
  ): Promise<T> {
    // Check in-memory cache first
    const now = Date.now();
    const entry = inMemoryCache[key];
    if (entry && entry.expiresAt > now) {
      console.log(`Returning cached data for ${key} (in-memory)`);
      return entry.data as T;
    }

    // Fetch fresh data and cache it in-memory
    console.log(`Fetching fresh data for ${key}`);
    const data = await fetchFn();
    inMemoryCache[key] = { data, expiresAt: now + CACHE_TTL };
    return data;
  }

  // Clear cache for a specific key, or clear all, or clear entries older than X days
  // Usage: clearCache('watchlists:all') OR clearCache(undefined, 7)
  public async clearCache(key?: string, olderThanDays?: number): Promise<void> {
    if (key) {
      delete inMemoryCache[key];
      return;
    }

    if (typeof olderThanDays === 'number') {
      const cutoff = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;
      Object.keys(inMemoryCache).forEach(k => {
        if (inMemoryCache[k].expiresAt < cutoff) delete inMemoryCache[k];
      });
      console.log(`Cleared market data cache older than ${olderThanDays} days`);
      return;
    }

    // Default: clear everything
    Object.keys(inMemoryCache).forEach(k => delete inMemoryCache[k]);
  }

  // Get calendar data with caching
  public async getCalendar(start: string, end: string) {
    if (!this.isInitialized()) {
      throw new Error('Alpaca client not initialized');
    }
    
    const cacheKey = `calendar:${start}:${end}`;
    return this.getData(cacheKey, () => 
      this.alpaca!.getCalendar({
        start,
        end,
      })
    );
  }

  // Get account activities with caching
  public async getAccountActivities(activityType: string, date?: string) {
    if (!this.isInitialized()) {
      throw new Error('Alpaca client not initialized');
    }
    
    const cacheKey = `activities:${activityType}:${date || 'all'}`;
    return this.getData(cacheKey, async () => {
      // newer SDK expects activityTypes and pagination params; wrap for compatibility
      const params: any = { activityTypes: activityType ? [activityType] : undefined };
      if (date) params.date = date;
      // call whatever method exists
      // @ts-ignore
      const resp = await (this.alpaca as any).getAccountActivities?.(params) ?? [];
      return resp;
    });
  }

  // Get market data with caching
  public async getMarketData(symbol: string, timeframe: string, start: string, end: string) {
    if (!this.isInitialized()) {
      throw new Error('Alpaca client not initialized');
    }
    
    const cacheKey = `marketdata:${symbol}:${timeframe}:${start}:${end}`;
    return this.getData(cacheKey, async () => {
      // prefer getBarsV2 if available
      // @ts-ignore
      if ((this.alpaca as any).getBarsV2) {
        // getBarsV2 returns an async iterator in some SDKs; normalize to array
        // @ts-ignore
        const it = (this.alpaca as any).getBarsV2(symbol, { start, end, timeframe });
        const out: any[] = [];
        if (it && typeof it[Symbol.asyncIterator] === 'function') {
          for await (const b of it) out.push(b);
          return out;
        }
      }
      // fallback to getBars if present
      // @ts-ignore
      return await (this.alpaca as any).getBars?.({ symbol, timeframe, start, end }) ?? [];
    });
  }

  // Get watchlists with caching
  public async getWatchlists() {
    if (!this.isInitialized()) {
      throw new Error('Alpaca client not initialized');
    }
    
    const cacheKey = `watchlists:all`;
    return this.getData(cacheKey, async () => {
      // @ts-ignore
      return await (this.alpaca as any).getWatchlists?.() ?? [];
    });
  }

  // Create a new watchlist
  public async createWatchlist(name: string, symbols: string[]) {
    if (!this.isInitialized()) {
      throw new Error('Alpaca client not initialized');
    }
    
  // @ts-ignore
  const watchlist = await (this.alpaca as any).createWatchlist?.({ name, symbols }) ?? null;
    
    // Invalidate the watchlists cache
    await this.clearCache('watchlists:all');
    
    return watchlist;
  }

  // Get portfolio history with caching
  public async getPortfolioHistory(timeframe: string) {
    if (!this.isInitialized()) {
      throw new Error('Alpaca client not initialized');
    }
    
    const cacheKey = `portfolio:history:${timeframe}`;
    return this.getData(cacheKey, async () => {
      // normalize call shape for possible SDK versions
      const params: any = { period: timeframe, timeframe: '1D' };
      // @ts-ignore
      return await (this.alpaca as any).getPortfolioHistory?.(params) ?? {};
    });
  }

  async cacheData(symbol: string, timeframe: string, data: MarketDataBar[]) {
  const key = `market:${symbol}:${timeframe}`;
  inMemoryCache[key] = { data, expiresAt: Date.now() + (60 * 60 * 1000) };
  }
  
  async getCachedData(symbol: string, timeframe: string, maxAge: number = 3600000): Promise<MarketDataBar[] | null> {
    const key = `market:${symbol}:${timeframe}`;
    const entry = inMemoryCache[key];
    if (!entry) return null;
    if (Date.now() - (entry.expiresAt - CACHE_TTL) > maxAge) return null;
    return entry.data as MarketDataBar[];
  }
  
  // keep legacy-compatible method name (alias)
  async clearOldCache(olderThanDays: number = 7) {
    await this.clearCache(undefined, olderThanDays);
  }

  /**
   * Compatibility wrappers
   * Provide getAccount, getOrders, getPositions aliases used by API routes.
   * These wrap the underlying Alpaca client methods when available and cache results.
   */

  public async getAccount() {
    if (!this.isInitialized()) {
      throw new Error('Alpaca client not initialized');
    }
    const cacheKey = `account:info`;
    return this.getData(cacheKey, async () => {
      // @ts-ignore
      return await (this.alpaca as any).getAccount?.() ?? {};
    });
  }

  public async getOrders(status?: string) {
    if (!this.isInitialized()) {
      throw new Error('Alpaca client not initialized');
    }
    const cacheKey = `orders:${status ?? 'all'}`;
    return this.getData(cacheKey, async () => {
      const params: any = {};
      if (status) params.status = status;
      // @ts-ignore
      return await (this.alpaca as any).getOrders?.(params) ?? [];
    });
  }

  public async getPositions() {
    if (!this.isInitialized()) {
      throw new Error('Alpaca client not initialized');
    }
    const cacheKey = `positions:all`;
    return this.getData(cacheKey, async () => {
      // @ts-ignore
      return await (this.alpaca as any).getPositions?.() ?? [];
    });
  }
}

// Create singleton instance
export const marketDataCache = new MarketDataCacheService();
