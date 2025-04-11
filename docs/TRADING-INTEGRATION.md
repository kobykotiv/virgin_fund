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

## Chart Integration

We use TradingView widgets for chart visualization:

```typescript
// TradingView widget integration
interface TradingViewConfig {
  symbol: string;  // Asset symbol (e.g., 'AAPL', 'BTCUSD')
  theme: 'light' | 'dark';
  interval: string; // Timeframe: '1', '5', '15', '60', 'D', 'W'
  container_id: string;
}

// Usage example
new TradingView.widget({
  symbol: 'AAPL',
  theme: 'light',
  interval: 'D',
  container_id: 'tradingview_chart',
  // Additional configuration...
});
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
