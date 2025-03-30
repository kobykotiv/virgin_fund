# API Routes Documentation

## Overview
This document details all API routes in the Virgin Fund application.

## Core API Routes

### Bot Management
- `GET /api/bots` - List all trading bots
- `POST /api/bots` - Create new trading bot
- `GET /api/bots/[id]` - Get specific bot details
- `PUT /api/bots/[id]` - Update bot configuration
- `DELETE /api/bots/[id]` - Delete a bot

### Signal Management 
- `GET /api/signals` - List trading signals with filters
- `POST /api/signals` - Create new trading signal

### Strategy Management
- `GET /api/strategies/[id]` - Get specific strategy
- `PUT /api/strategies/[id]` - Update strategy
- `DELETE /api/strategies/[id]` - Delete strategy

### Index Management
- `GET /api/indexes` - List market indexes
- `POST /api/indexes` - Create index
- `GET /api/indexes/[id]` - Get specific index
- `PUT /api/indexes/[id]` - Update index
- `DELETE /api/indexes/[id]` - Delete index

## Database API Routes

### Strategies
- `GET /api/db/strategies` - List all strategies with optional type/risk filters
- `POST /api/db/strategies` - Create a new strategy
- `PUT /api/db/strategies` - Update existing strategy
- `DELETE /api/db/strategies` - Delete strategy (checks for active bots first)

### Risk Metrics
- `GET /api/db/risk-metrics` - Get risk metrics with portfolio/timeframe filters
- `POST /api/db/risk-metrics` - Create new risk metrics record
- `PUT /api/db/risk-metrics` - Update existing risk metrics
- `DELETE /api/db/risk-metrics` - Delete risk metrics record

### Backtest
- `GET /api/db/backtest` - Get backtest results with strategy/symbol filters
- `POST /api/db/backtest` - Create new backtest result
- `PUT /api/db/backtest` - Update existing backtest result 
- `DELETE /api/db/backtest` - Delete backtest result

### Portfolios
- `GET /api/db/portfolios` - List all portfolios with account type filter
- `POST /api/db/portfolios` - Create new portfolio
- `PUT /api/db/portfolios` - Update portfolio
- `DELETE /api/db/portfolios` - Delete portfolio
- `GET /api/db/portfolios/[id]` - Get specific portfolio
- `PATCH /api/db/portfolios/[id]` - Update specific portfolio
- `DELETE /api/db/portfolios/[id]` - Delete specific portfolio

### Performance
- `GET /api/db/performance` - Get performance records with account type filter  
- `POST /api/db/performance` - Create performance record
- `GET /api/db/performance/[id]` - Get specific performance record
- `PATCH /api/db/performance/[id]` - Update specific performance record
- `DELETE /api/db/performance/[id]` - Delete specific performance record

### Trading Signals
- `GET /api/db/trading-signals` - Get signals with symbol/type filters
- `POST /api/db/trading-signals` - Create new trading signal

### Trades
- `GET /api/db/trades` - List trades with symbol/type filters 
- `POST /api/db/trades` - Create new trade
- `PUT /api/db/trades` - Update trade
- `DELETE /api/db/trades` - Delete trade

### Bots
- `GET /api/db/bots` - List bots with status/strategy filters
- `POST /api/db/bots` - Create new bot

## Integration Routes

### Alpaca Integration
- `GET /api/alpaca/market` - Get real-time market data
- `GET /api/alpaca/historical` - Get historical price data
- `GET /api/alpaca/status` - Check API connection status
- `POST /api/alpaca/configure` - Configure API credentials

### CoinGecko Integration  
- `GET /api/coingecko/market` - Get cryptocurrency market data

## Error Handling
All routes implement consistent error handling:
- 400 Bad Request - Invalid input
- 401 Unauthorized - Authentication issues
- 403 Forbidden - Permission issues  
- 404 Not Found - Resource not found
- 500 Internal Server Error - Server-side errors

## Authentication
Protected routes require valid authentication headers:
```http
Authorization: Bearer <token>
```

## Rate Limiting
Default rate limits:
- 100 requests per minute per IP
- 1000 requests per hour per user
