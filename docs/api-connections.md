# API Connections Management

## Overview
Users can maintain multiple API connections for different trading platforms and data providers.

## Connection Schema
```typescript
interface APIConnection {
  id: string;
  userId: string;
  provider: 'alpaca' | 'binance' | 'coingecko' | 'custom';
  credentials: {
    apiKey: string;
    secretKey: string;
    additionalKeys?: Record<string, string>;
  };
  status: 'active' | 'inactive' | 'error';
  lastChecked: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## Available Providers
1. Alpaca Markets
   - Stocks and crypto trading
   - Real-time market data
   - Paper trading support

2. Binance
   - Cryptocurrency trading
   - Spot and futures markets
   - WebSocket feeds

3. CoinGecko
   - Crypto market data
   - Historical price data
   - No trading capabilities

## Security Measures
- API keys are encrypted at rest using AES-256
- Keys are never exposed in logs or error messages
- Automatic key rotation support
- IP whitelisting where supported

## API Rate Limiting
Each provider connection maintains its own rate limits:
- Alpaca: 200 requests/minute
- Binance: 1200 requests/minute
- CoinGecko: 50 requests/minute

## Connection Management
- Auto-retry on temporary failures
- Health check monitoring
- Automatic failover support
- Connection pooling
