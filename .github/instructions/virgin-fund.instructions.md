# Purpose
Build the **Virgin Fund : GenEric TraDer AI** platform — a full-stack trading and portfolio management app with Alpaca Markets integration, virtual fund simulation, and a comprehensive dashboard.

# Core Features & Sections
- **Theme Toggle**: Light/Dark mode, persisted in user settings.
- **Overview**: Summary of account value, P&L, positions, recent activity.
- **Custom Signals**: Create reusable trading signals (TA indicators, custom logic).
- **Signal Builder**: Visual + code DSL to build and test signals.
- **Backtest**: Run strategies on historical data with adjustable parameters.
- **Savings Calculator**: Project growth of deposits over time.
- **Compound Interest Calculator**: FV = PV * (1 + r/n)^(n*t).
- **Inflation Calculator**: Adjust amounts for future value given an inflation rate.
- **Retirement Calculator**: Target-based, Monte Carlo option.
- **Portfolio**: Holdings, allocations, performance metrics.
- **Financial Calculators**:
  - Compound Interest
  - Savings
  - Retirement
  - Mortgage
  - Inflation
  - Debt Payoff
  - Fee Impact
- **Trading Calculators**:
  - Risk/Reward
  - Position Size
  - Leverage
  - Pivot Points
  - Spread
  - Options Greeks
- **Monte Carlo**: Simulate multiple random market paths for probability distribution.
- **Bot Manager**: Alpaca Markets Trading Bots; status, configuration, lifecycle controls.
- **Performance**: Charts and metrics for account, bots, and strategies.
- **Market Data**: Live quotes, charts, search symbols, grid/list toggle.
- **API Configuration**: Connect to Alpaca or run in Demo Mode; manage keys and settings.

# UI Elements
- **Global**: 
  - Plan banner: “You are on the Free plan. Upgrade to enable live trading.”
  - Demo Mode banner with Base URL, Key ID, Environment, Data Source.
  - Dashboard Mode toggle (Enhanced/Default).
  - Last updated timestamp.
  - Live Market Data toggle.
  - Search symbols, Grid/List switch, Refresh button.
- **Bot Status**: Total bots, active/paused counts.
- **Portfolio Value**: Cash, P&L, average return.
- **Recent Activity**: Logs for bot updates and trades.
- **Recent Orders**: Latest trade history.

# Architecture
- **Frontend**: React SPA, TailwindCSS, React Query.
- **Backend**: Bun/Node/Deno API server.
- **Database**: PostgreSQL.
- **Workers**: BullMQ for backtests and bot execution.
- **Market Data**: Alpaca REST + WebSocket.

# Integration Rules
- Support **two modes**: Alpaca Paper API and internal simulation.
- Live trading gated by plan level.
- API keys stored encrypted.
- Backtest runs in workers, results persisted.
- WebSocket server proxies Alpaca market data streams.

# Output Expectations
When using this .instructions file, generate:
- Backend endpoints & DB schema for the sections above.
- Frontend components, pages, and state logic.
- Integration with Alpaca’s Paper API endpoints:
  - `/v2/account`
  - `/v2/positions`
  - `/v2/orders`
  - Market Data API
- WebSocket implementation for live quotes and account/order updates.
- UI components with real-time updates and demo/live mode banners.
