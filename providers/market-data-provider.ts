// providers/market-data-provider.ts

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

export class AlpacaProvider implements MarketDataProvider {
  private apiKey: string;
  private apiSecret: string;

  constructor(apiKey: string, apiSecret: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  async getQuote(symbol: string): Promise<Quote> {
    const res = await fetch(`https://data.alpaca.markets/v2/stocks/${symbol}/trades/latest`, {
      headers: {
        'APCA-API-KEY-ID': this.apiKey,
        'APCA-API-SECRET-KEY': this.apiSecret
      }
    });
    if (!res.ok) throw new Error('Alpaca quote fetch failed');
    const data = await res.json();
    return {
      symbol,
      price: data.trade.price,
      timestamp: new Date(data.trade.t).getTime(),
      source: 'alpaca'
    };
  }

  async getHistoricalData(symbol: string, timeframe: string): Promise<BarData[]> {
    const res = await fetch(`https://data.alpaca.markets/v2/stocks/${symbol}/bars?timeframe=${timeframe}`, {
      headers: {
        'APCA-API-KEY-ID': this.apiKey,
        'APCA-API-SECRET-KEY': this.apiSecret
      }
    });
    if (!res.ok) throw new Error('Alpaca bars fetch failed');
    const data = await res.json();
    return data.bars.map((bar: any) => ({
      timestamp: new Date(bar.t).getTime(),
      open: bar.o,
      high: bar.h,
      low: bar.l,
      close: bar.c,
      volume: bar.v
    }));
  }
}

export class YahooProvider implements MarketDataProvider {
  async getQuote(symbol: string): Promise<Quote> {
    const res = await fetch(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`);
    if (!res.ok) throw new Error('Yahoo quote fetch failed');
    const data = await res.json();
    const quote = data.quoteResponse.result[0];
    return {
      symbol,
      price: quote.regularMarketPrice,
      timestamp: Date.now(),
      source: 'yahoo'
    };
  }

  async getHistoricalData(symbol: string, timeframe: string): Promise<BarData[]> {
    // Placeholder: Yahoo Finance historical data API would be used here
    return [];
  }
}

export class MockProvider implements MarketDataProvider {
  private mockData: Record<string, Quote>;

  constructor(mockData: Record<string, Quote>) {
    this.mockData = mockData;
  }

  async getQuote(symbol: string): Promise<Quote> {
    if (!this.mockData[symbol]) throw new Error('Symbol not found');
    return this.mockData[symbol];
  }

  async getHistoricalData(symbol: string, timeframe: string): Promise<BarData[]> {
    return [];
  }
}

export class FallbackProvider implements MarketDataProvider {
  private providers: MarketDataProvider[];

  constructor(providers: MarketDataProvider[]) {
    this.providers = providers;
  }

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
