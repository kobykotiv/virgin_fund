# CoinGecko API Integration

## Overview
The application integrates with CoinGecko's API to fetch cryptocurrency market data. Currently implemented as a mock service for demonstration purposes.

## Endpoint Implementation
Located at `/api/coingecko/market`

### Market Data Endpoint
```typescript
GET /api/coingecko/market?symbol={symbol}
```

#### Response Format
```json
{
  "symbol": string,
  "price": number,
  "change": number,
  "changePercent": number,
  "volume": number,
  "high": number,
  "low": number,
  "open": number,
  "previousClose": number,
  "marketCap": number | undefined,
  "timestamp": string
}
```

## Mock Implementation
Currently implements mock data for:
- BTC (Bitcoin) - Base price ~$28,000
- ETH (Ethereum) - Base price ~$1,800
- Other symbols - Base price ~$100

The mock service adds random variations to simulate real-time price movements.

## Production Implementation
To implement real CoinGecko API:
1. Sign up for API key at https://coingecko.com/api
2. Add API key to environment variables
3. Replace mock implementation with real API calls
4. Implement rate limiting and caching

## API Endpoints
The following CoinGecko endpoints are used:

### Simple Price
```typescript
/simple/price?ids=${coinIds}&vs_currencies=usd&include_24hr_change=true
```

### Market Data
```typescript
/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1
```

### Historical Data
```typescript
/coins/${id}/market_chart?vs_currency=usd&days=${days}
```

## Error Handling
The integration handles common error cases:
- Rate limiting (429 errors)
- API downtime
- Invalid coin IDs
- Network timeouts

## Caching Strategy
Implements caching to respect rate limits:
- Simple price data: 30 second cache
- Market data: 5 minute cache
- Historical data: 1 hour cache

## Mock Mode
For development/demo purposes, mock data is provided:
- Simulated price movements
- Realistic trading volumes
- Common cryptocurrency pairs

## Usage Examples
```typescript
// Fetch price data
const btcPrice = await getPrice('bitcoin');

// Get historical data
const ethHistory = await getHistory('ethereum', 30);

// Market overview
const topCoins = await getMarkets();
```
