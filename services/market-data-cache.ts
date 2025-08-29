import { supabase } from '@/lib/supabase-client';
import { MarketDataBar } from '@/types/market';

// Cache configuration
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes in milliseconds

class MarketDataCacheService {
  // Check if Alpaca client is initialized (for backward compatibility)
  public isInitialized(): boolean {
    return true; // Always return true since we're using API routes
  }

  // Get data from cache or fetch from API
  public async getData<T>(
    key: string,
    fetchFn: () => Promise<T>
  ): Promise<T> {
    try {
      // Check if we have valid cached data
      const now = new Date();
      const expiresAt = new Date(now.getTime() + CACHE_TTL);

      const { data: cachedEntry, error } = await supabase
        .from('market_data_cache')
        .select('data')
        .eq('key', key)
        .gt('expires_at', now.toISOString())
        .single();

      if (cachedEntry && !error) {
        console.log(`Returning cached data for ${key}`);
        return cachedEntry.data as T;
      }

      // Fetch fresh data
      console.log(`Fetching fresh data for ${key}`);
      const data = await fetchFn();

      // Cache the result
      const { error: upsertError } = await supabase
        .from('market_data_cache')
        .upsert({
          key,
          data,
          expires_at: expiresAt.toISOString(),
          last_updated: now.toISOString()
        }, {
          onConflict: 'key'
        });

      if (upsertError) {
        console.error('Error caching data:', upsertError);
      }

      return data;
    } catch (error) {
      console.error('Error in getData:', error);
      // If caching fails, just return fresh data
      return await fetchFn();
    }
  }

  // Clear cache for a specific key or all cache if no key provided
  public async clearCache(key?: string): Promise<void> {
    try {
      if (key) {
        const { error } = await supabase
          .from('market_data_cache')
          .delete()
          .eq('key', key);

        if (error) {
          console.error('Error clearing cache for key:', error);
        }
      } else {
        const { error } = await supabase
          .from('market_data_cache')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

        if (error) {
          console.error('Error clearing all cache:', error);
        }
      }
    } catch (error) {
      console.error('Error in clearCache:', error);
    }
  }

  // Get calendar data with caching
  public async getCalendar(start: string, end: string) {
    const cacheKey = `calendar:${start}:${end}`;
    return this.getData(cacheKey, async () => {
      const response = await fetch(`/api/market/calendar?start=${start}&end=${end}`);
      if (!response.ok) {
        throw new Error('Failed to fetch calendar data');
      }
      return response.json();
    });
  }

  // Get account activities with caching
  public async getAccountActivities(activityType: string, date?: string) {
    const cacheKey = `activities:${activityType}:${date || 'all'}`;
    return this.getData(cacheKey, async () => {
      const url = `/api/market/activities?activityType=${activityType}${date ? `&date=${date}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch account activities');
      }
      return response.json();
    });
  }

  // Get market data with caching
  public async getMarketData(symbol: string, timeframe: string, start: string, end: string) {
    const cacheKey = `marketdata:${symbol}:${timeframe}:${start}:${end}`;
    return this.getData(cacheKey, async () => {
      const url = `/api/market/data?symbol=${symbol}&timeframe=${timeframe}&start=${start}&end=${end}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch market data');
      }
      const result = await response.json();
      return result.data;
    });
  }

  // Get watchlists with caching
  public async getWatchlists() {
    const cacheKey = `watchlists:all`;
    return this.getData(cacheKey, async () => {
      const response = await fetch('/api/market/watchlists');
      if (!response.ok) {
        throw new Error('Failed to fetch watchlists');
      }
      const result = await response.json();
      return result.data;
    });
  }

  // Create a new watchlist
  public async createWatchlist(name: string, symbols: string[]) {
    const response = await fetch('/api/market/watchlists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, symbols }),
    });

    if (!response.ok) {
      throw new Error('Failed to create watchlist');
    }

    const result = await response.json();

    // Invalidate the watchlists cache
    await this.clearCache('watchlists:all');

    return result.data;
  }

  // Get portfolio history with caching
  public async getPortfolioHistory(timeframe: string) {
    const cacheKey = `portfolio:history:${timeframe}`;
    return this.getData(cacheKey, async () => {
      const response = await fetch(`/api/market/portfolio?timeframe=${timeframe}`);
      if (!response.ok) {
        throw new Error('Failed to fetch portfolio history');
      }
      const result = await response.json();
      return result.data;
    });
  }

  // Get account data
  public async getAccount() {
    const cacheKey = `account`;
    return this.getData(cacheKey, async () => {
      const response = await fetch('/api/market/account');
      if (!response.ok) {
        throw new Error('Failed to fetch account data');
      }
      const result = await response.json();
      return result.data;
    });
  }

  // Get positions
  public async getPositions() {
    const cacheKey = `positions`;
    return this.getData(cacheKey, async () => {
      const response = await fetch('/api/market/positions');
      if (!response.ok) {
        throw new Error('Failed to fetch positions');
      }
      const result = await response.json();
      return result.data;
    });
  }

  // Get orders
  public async getOrders(status = 'open') {
    const cacheKey = `orders:${status}`;
    return this.getData(cacheKey, async () => {
      const response = await fetch(`/api/market/orders?status=${status}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const result = await response.json();
      return result.data;
    });
  }

  async cacheData(symbol: string, timeframe: string, data: MarketDataBar[]) {
    try {
      const now = new Date();
      const cacheKey = `marketdata:${symbol}:${timeframe}`;

      const { error } = await supabase
        .from('market_data_cache')
        .upsert({
          key: cacheKey,
          symbol,
          timeframe,
          data,
          last_updated: now.toISOString(),
          expires_at: new Date(now.getTime() + CACHE_TTL).toISOString()
        }, {
          onConflict: 'key'
        });

      if (error) {
        console.error('Error caching market data:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error caching market data:', error);
      throw error;
    }
  }

  async getCachedData(symbol: string, timeframe: string, maxAge: number = 3600000): Promise<MarketDataBar[] | null> {
    try {
      const cacheKey = `marketdata:${symbol}:${timeframe}`;
      const now = new Date();
      const maxAgeDate = new Date(now.getTime() - maxAge);

      const { data: cachedData, error } = await supabase
        .from('market_data_cache')
        .select('data, last_updated')
        .eq('key', cacheKey)
        .gt('last_updated', maxAgeDate.toISOString())
        .single();

      if (error || !cachedData) {
        return null;
      }

      return cachedData.data as MarketDataBar[];
    } catch (error) {
      console.error('Error retrieving cached market data:', error);
      return null;
    }
  }

  async clearOldCache(olderThanDays: number = 7) {
    try {
      const date = new Date();
      date.setDate(date.getDate() - olderThanDays);

      const { error } = await supabase
        .from('market_data_cache')
        .delete()
        .lt('last_updated', date.toISOString());

      if (error) {
        console.error('Error clearing old cache:', error);
        throw error;
      }

      console.log(`Cleared market data cache older than ${olderThanDays} days`);
    } catch (error) {
      console.error('Error clearing market data cache:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const marketDataCache = new MarketDataCacheService();
