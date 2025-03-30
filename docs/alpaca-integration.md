# Alpaca Markets Integration

## Overview
Integration with Alpaca Markets for stock trading functionality and market data.

## Configuration
Located in `/api/alpaca/status` and `/api/alpaca/configure`

### Environment Variables
```env
NEXT_PUBLIC_ALPACA_KEY_ID=your_key_here
NEXT_PUBLIC_ALPACA_SECRET_KEY=your_secret_here
NEXT_PUBLIC_ALPACA_BASE_URL=https://paper-api.alpaca.markets
```

## Available Endpoints

### Account Information
```typescript
GET /v2/account
```
Fetches account details, balance, and trading status

### Market Data
```typescript
GET /v2/stocks/{symbol}/trades/latest
GET /v2/stocks/{symbol}/bars
```

### Order Management  
```typescript
POST /v2/orders
GET /v2/orders
DELETE /v2/orders/{order_id}
```

### Historical Data
```typescript
GET /api/alpaca/historical?symbol={symbol}&timeframe={timeframe}&limit={limit}
```
Fetches historical price data with customizable timeframes

### Configuration Status
```typescript
GET /api/alpaca/status
POST /api/alpaca/configure
```
Manages API configuration and connection status

## WebSocket Integration
Real-time data streams available for:
- Trade updates
- Order updates  
- Position changes

## Authentication
Required headers:
```http
APCA-API-KEY-ID: <key>
APCA-API-SECRET-KEY: <secret>
```

## Environments
Two available endpoints:
- Paper Trading: https://paper-api.alpaca.markets
- Live Trading: https://api.alpaca.markets

## Implementation Details

### Market Data Handling
```typescript
interface MarketData {
  symbol: string;
  price: number; 
  timestamp: string;
  volume: number;
  trade_count: number;
}
```

### Order Types Supported
- Market orders
- Limit orders  
- Stop orders
- Stop limit orders

## Error Handling
- Implements proper error handling for API failures
- Returns appropriate HTTP status codes
- Includes detailed error messages in development

## Paper Trading
- Default configuration uses paper trading environment
- Allows testing without real money
- Simulates real market conditions

## Production Usage
To move to live trading:
1. Update base URL to production endpoint
2. Replace paper trading credentials with live credentials
3. Implement additional security measures
4. Add trading limits and risk management

### Risk Management
Built-in protections:
- Position limits
- Order value limits
- Pattern day trading rules
