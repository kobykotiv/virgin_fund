# DevOps Progress Report → Instructions Template

## Usage
Paste your progress report below. Copilot will automatically convert it into actionable, step-by-step development instructions for any module or section.

---

## Template

### 1. Backend Development
1. Implement API endpoints in Bun/TypeScript (or project language) for all required operations.
2. Define and export TypeScript interfaces for all data models.
3. Include inline documentation and API comments for all functions.
4. Write unit tests for all CRUD operations (cover basic happy paths first).

---

### 2. Feature Expansion
5. Add support for advanced features and external integrations (e.g., Alpaca API, analytics, etc.).
6. Implement input validation for all operations.
7. Expand error handling for API calls, database operations, and external service failures.

---

### 3. Testing
8. Add unit tests for edge cases and error scenarios.
9. Ensure all tests pass locally and in CI/CD pipeline.

---

### 4. Frontend Integration
10. Connect backend endpoints to the relevant frontend dashboard or UI.
11. Implement real-time status updates and notifications (if applicable).
12. Add role-based access control for management actions.

---

### 5. Documentation
13. Document all API endpoints, expected request/response formats, and authentication requirements.
14. Maintain changelog for backend API updates.

---

### 6. Risk Mitigation
15. Implement secure API key storage and retrieval for external integrations.
16. Monitor and handle rate limits gracefully.

---

### 7. Next Milestones
17. Complete external API integrations and finalize unit tests/documentation.
18. Begin integration with related modules (e.g., Signal Builder, Backtest).
19. Conduct performance review and backend optimization before production.

---

## Example
Paste your progress report here and Copilot will generate instructions using the above template.


# Trading Integration

## Order Types

The platform supports various order types through Alpaca's API:

### Market Orders
```typescript
interface MarketOrder {
  symbol: string;
  qty: number;
  side: 'buy' | 'sell';
  type: 'market';
  time_in_force: 'day' | 'gtc';
}
```

### Limit Orders
```typescript
interface LimitOrder extends BaseOrder {
  type: 'limit';
  limit_price: number;
}
```

## Fractional Trading

Implemented through Alpaca's fractional trading API:

```typescript
async function placeFractionalOrder(
  symbol: string, 
  qty: number, 
  notional?: number
): Promise<Order> {
  return client.placeOrder({
    symbol,
    qty: qty.toFixed(6), // Support up to 6 decimal places
    notional, // Optional dollar amount instead of quantity
    side: 'buy',
    type: 'market',
    time_in_force: 'day'
  });
}
```

## Testing Support

```typescript
class MockTradingClient {
  async placeOrder(order: any): Promise<Order> {
    return {
      id: 'mock-order-id',
      symbol: order.symbol,
      qty: order.qty,
      status: 'filled',
      filled_at: new Date().toISOString()
    };
  }
}
```

## Error Handling

```typescript
try {
  const order = await tradingClient.placeOrder(orderParams);
} catch (error) {
  if (error.code === 'insufficient_funds') {
    // Handle insufficient funds
  } else if (error.code === 'market_closed') {
    // Handle market closed
  }
  // Log error and notify user
}
```


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
