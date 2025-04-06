import { AlpacaClient } from '@alpacahq/alpaca-trade-api';
import mongoose from 'mongoose';
import MarketDataCache from '@/models/mongodb/MarketDataCache';
import { connectToDatabase, disconnectFromDatabase } from '@/lib/db/models';
import { Document } from 'mongodb';

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
    await connectToDatabase();
    
    try {
      // Check if we have valid cached data
      const now = Date.now();
      const cachedEntry = await MarketDataCache.findOne({ key, expiresAt: { $gt: now } });
      
      if (cachedEntry) {
        console.log(`Returning cached data for ${key}`);
        return cachedEntry.data;
      }
      
      // Fetch fresh data
      console.log(`Fetching fresh data for ${key}`);
      const data = await fetchFn();
      
      // Cache the result
      await MarketDataCache.findOneAndUpdate(
        { key },
        { 
          key,
          data,
          timestamp: now,
          expiresAt: new Date(now + CACHE_TTL)
        },
        { upsert: true, new: true }
      );
      
      return data;
    } finally {
      await disconnectFromDatabase();
    }
  }

  // Clear cache for a specific key or all cache if no key provided
  public async clearCache(key?: string): Promise<void> {
    await connectToDatabase();
    
    try {
      if (key) {
        await MarketDataCache.deleteOne({ key });
      } else {
        await MarketDataCache.deleteMany({});
      }
    } finally {
      await disconnectFromDatabase();
    }
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
    return this.getData(cacheKey, () => 
      this.alpaca!.getAccountActivities({
        activityType,
        date,
      })
    );
  }

  // Get market data with caching
  public async getMarketData(symbol: string, timeframe: string, start: string, end: string) {
    if (!this.isInitialized()) {
      throw new Error('Alpaca client not initialized');
    }
    
    const cacheKey = `marketdata:${symbol}:${timeframe}:${start}:${end}`;
    return this.getData(cacheKey, () => 
      this.alpaca!.getBars({
        symbol,
        timeframe,
        start,
        end,
      })
    );
  }

  // Get watchlists with caching
  public async getWatchlists() {
    if (!this.isInitialized()) {
      throw new Error('Alpaca client not initialized');
    }
    
    const cacheKey = `watchlists:all`;
    return this.getData(cacheKey, () => 
      this.alpaca!.getWatchlists()
    );
  }

  // Create a new watchlist
  public async createWatchlist(name: string, symbols: string[]) {
    if (!this.isInitialized()) {
      throw new Error('Alpaca client not initialized');
    }
    
    const watchlist = await this.alpaca!.createWatchlist({
      name,
      symbols
    });
    
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
    return this.getData(cacheKey, () => 
      this.alpaca!.getPortfolioHistory({
        period: timeframe,
        timeframe: '1D'
      })
    );
  }
}

// Create singleton instance
export const marketDataCache = new MarketDataCacheService();
