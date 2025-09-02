# Bun Server - Trading Agent Middleware Backend

A high-performance Bun-based backend providing REST API and WebSocket services for the Trading Agent dashboard.

## Features

- **REST API**: Comprehensive endpoints for portfolio, trading, analysis, and configuration
- **WebSocket**: Real-time portfolio updates and market quotes
- **Authentication**: JWT token validation with tenant isolation
- **CLI Integration**: Proxy for Python TradingAgents CLI execution
- **Mock Data**: Simulated market data when external APIs unavailable

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) v1.0.0 or higher
- Node.js 18+ (for compatibility)

### Installation

```bash
cd bun-server
bun install
```

### Environment Configuration

Create `.env` file:

```env
# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:3000

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# External APIs (Optional - will use mock data if not provided)
ALPACA_API_KEY=your-alpaca-api-key
ALPACA_SECRET_KEY=your-alpaca-secret-key
ALPACA_BASE_URL=https://paper-api.alpaca.markets

# TradingAgents CLI (Optional)
TRADING_AGENTS_CLI_PATH=/path/to/tradingagents
```

### Development

```bash
# Start development server with hot reload
bun run dev

# Type checking
bun run type-check

# Production build
bun run build
bun run start
```

## API Endpoints

### Portfolio
- `GET /api/portfolio` - Get current portfolio status
- `GET /api/heatmap` - Portfolio performance heatmap data

### Trading
- `POST /api/trades/execute` - Execute a trade
- `GET /api/trades/open` - Get open positions
- `GET /api/trades/history` - Trading history

### Analysis
- `GET /api/agents/status` - Get agent status
- `POST /api/agents/analyze` - Start analysis job
- `GET /api/indicators/:symbol` - Technical indicators
- `GET /api/news/:symbol` - News feed for symbol

### Scheduler
- `GET /api/scheduler/jobs` - List scheduled jobs
- `POST /api/scheduler/jobs` - Create new job
- `DELETE /api/scheduler/jobs/:id` - Cancel job

### Reports
- `GET /api/reports/pnl` - P&L report
- `GET /api/reports/metrics` - Performance metrics
- `GET /api/reports/export` - Export data

### Settings
- `GET /api/settings/profile` - User profile
- `POST /api/settings/profile` - Update profile
- `GET /api/integrations` - List integrations
- `POST /api/integrations/connect` - Connect service
- `DELETE /api/integrations/:id` - Disconnect service

## WebSocket Events

Connect to `ws://localhost:3001/ws` with Bearer token in `Authorization` header.

### Incoming Events
- `portfolio_update` - Real-time portfolio changes
- `quote_update` - Market price updates
- `analysis_progress` - CLI job progress
- `trade_notification` - Trade execution alerts

### Outgoing Events
- `subscribe_portfolio` - Subscribe to portfolio updates
- `subscribe_quotes` - Subscribe to quote updates for symbols
- `unsubscribe` - Stop subscriptions

## Architecture

```
src/
├── server.ts              # Main server entry point
├── routes/
│   └── api.ts            # REST API routes
├── utils/
│   ├── auth.ts           # JWT authentication middleware
│   └── wsManager.ts      # WebSocket connection manager
└── agents/
    └── cliProxy.ts       # Python CLI integration
```

## Development Notes

- Uses Bun's native HTTP server for optimal performance
- Graceful fallback to mock data when external services unavailable
- Comprehensive error handling with proper HTTP status codes
- CORS enabled for frontend development
- Request logging for debugging

## Production Deployment

1. Set production environment variables
2. Build the application: `bun run build`
3. Start with: `bun run start`
4. Consider using PM2 or similar for process management
5. Set up reverse proxy (nginx) for HTTPS and load balancing