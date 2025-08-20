// Market Data Provider Interfaces and Implementations

export interface Quote {
  symbol: string;
  price: number;
  timestamp: number;
  source: 'alpaca' | 'yahoo' | 'mock';
}

export interface BarData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketDataProvider {
  getQuote(symbol: string): Promise<Quote>;
  getHistoricalData(symbol: string, timeframe: string): Promise<BarData[]>;
  watchSymbol?(symbol: string, callback: (data: Quote) => void): void;
}

import Alpaca from '@alpacahq/alpaca-trade-api';

export class AlpacaProvider implements MarketDataProvider {
  private client: any;
  constructor(private config: any) {
    this.client = new Alpaca({
      keyId: config.keyId,
      secretKey: config.secretKey,
      paper: config.paper || false,
    });
  }
  async getQuote(symbol: string): Promise<Quote> {
    const data = await this.client.getLatestTrade(symbol);
    return {
      symbol,
      price: data.Price || data.price,
      timestamp: new Date(data.Timestamp || data.timestamp).getTime(),
      source: 'alpaca',
    };
  }
  async getHistoricalData(symbol: string, timeframe: string): Promise<BarData[]> {
    const bars = await this.client.getBarsV2(symbol, { timeframe });
    const result: BarData[] = [];
    for await (const bar of bars) {
      result.push({
        timestamp: new Date(bar.t).getTime(),
        open: bar.o,
        high: bar.h,
        low: bar.l,
        close: bar.c,
        volume: bar.v,
      });
    }
    return result;
  }
}

import yahooFinance from 'yahoo-finance2';

export class YahooProvider implements MarketDataProvider {
  async getQuote(symbol: string): Promise<Quote> {
    const data = await yahooFinance.quote(symbol);
    return {
      symbol,
      price: data.regularMarketPrice ?? 0,
      timestamp: Date.now(),
      source: 'yahoo',
    };
  }
  async getHistoricalData(symbol: string, timeframe: string): Promise<BarData[]> {
    // Map timeframe to yahoo-finance2 interval
    let interval: '1d' | '1wk' | '1mo' = '1d';
    if (timeframe === '1wk') interval = '1wk';
    if (timeframe === '1mo') interval = '1mo';
    const now = new Date();
    const period1 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    const bars = await yahooFinance.historical(symbol, {
      period1,
      period2: now,
      interval,
    });
    return bars.map((bar: any) => ({
      timestamp: new Date(bar.date).getTime(),
      open: bar.open ?? 0,
      high: bar.high ?? 0,
      low: bar.low ?? 0,
      close: bar.close ?? 0,
      volume: bar.volume ?? 0,
    }));
  }
}

// Mock Provider
export class MockProvider implements MarketDataProvider {
  constructor(private mockData: Record<string, Quote>) {}
  async getQuote(symbol: string): Promise<Quote> {
    if (!this.mockData[symbol]) throw new Error('Symbol not found');
    return this.mockData[symbol];
  }
  async getHistoricalData(symbol: string, timeframe: string): Promise<BarData[]> {
    // Return empty or mock data
    return [];
  }
}

// Fallback Provider
export class FallbackProvider implements MarketDataProvider {
  constructor(private providers: MarketDataProvider[]) {}
  async getQuote(symbol: string): Promise<Quote> {
    for (const provider of this.providers) {
      try {
        return await provider.getQuote(symbol);
      } catch {
        continue;
      }
    }
    throw new Error('All providers failed');
  }
  async getHistoricalData(symbol: string, timeframe: string): Promise<BarData[]> {
    for (const provider of this.providers) {
      try {
        return await provider.getHistoricalData(symbol, timeframe);
      } catch {
        continue;
      }
    }
    throw new Error('All providers failed');
  }
}
