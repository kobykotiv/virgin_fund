# Market Data Providers

## Overview

This document details the implementation of market data providers using Alpaca API as primary and Yahoo Finance as fallback.

## Provider Interface

```typescript
interface MarketDataProvider {
  getQuote(symbol: string): Promise<Quote>;
  getHistoricalData(symbol: string, timeframe: Timeframe): Promise<BarData[]>;
  watchSymbol(symbol: string, callback: (data: Quote) => void): void;
}

interface Quote {
  symbol: string;
  price: number;
  timestamp: number;
  source: 'alpaca' | 'yahoo' | 'mock';
}

interface BarData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
```

## Implementation Examples

### Alpaca Provider
```typescript
import { AlpacaClient } from '@alpacahq/alpaca-trade-api';

class AlpacaProvider implements MarketDataProvider {
  private client: AlpacaClient;
  
  constructor(config: AlpacaConfig) {
    this.client = new AlpacaClient(config);
  }

  async getQuote(symbol: string): Promise<Quote> {
    const data = await this.client.getLatestTrade(symbol);
    return {
      symbol,
      price: data.price,
      timestamp: new Date(data.timestamp).getTime(),
      source: 'alpaca'
    };
  }
}
```

### Yahoo Finance Provider
```typescript
import yahooFinance from 'yahoo-finance2';

class YahooProvider implements MarketDataProvider {
  async getQuote(symbol: string): Promise<Quote> {
    const data = await yahooFinance.quote(symbol);
    return {
      symbol,
      price: data.regularMarketPrice,
      timestamp: Date.now(),
      source: 'yahoo'
    };
  }
}
```

## Fallback Strategy

```typescript
class FallbackProvider implements MarketDataProvider {
  private providers: MarketDataProvider[];

  constructor(providers: MarketDataProvider[]) {
    this.providers = providers;
  }

  async getQuote(symbol: string): Promise<Quote> {
    for (const provider of this.providers) {
      try {
        return await provider.getQuote(symbol);
      } catch (error) {
        continue;
      }
    }
    throw new Error('All providers failed');
  }
}
```

## Testing Support

```typescript
class MockProvider implements MarketDataProvider {
  private mockData: Record<string, Quote>;

  constructor(mockData: Record<string, Quote>) {
    this.mockData = mockData;
  }

  async getQuote(symbol: string): Promise<Quote> {
    if (!this.mockData[symbol]) {
      throw new Error('Symbol not found');
    }
    return this.mockData[symbol];
  }
}
```

## Usage Example

```typescript
const provider = new FallbackProvider([
  new AlpacaProvider(alpacaConfig),
  new YahooProvider(),
  new MockProvider(mockData)
]);

// Will try Alpaca first, then Yahoo, then mock data
const quote = await provider.getQuote('AAPL');
```
