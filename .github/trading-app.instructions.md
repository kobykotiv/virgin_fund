# Purpose

## Alpaca Broker API Integration Models

- **Fully-Disclosed Broker Dealer**: Users open individual accounts with Alpaca; you manage onboarding, trading, and reporting, and must maintain robust CIP/KYC/AML compliance.
- **Omnibus Broker Dealer**: You manage customer accounting and submit orders for a main trading account; customer info is not disclosed to Alpaca, and you handle all tax reporting and regulatory compliance. Submit a “sub-tag” with each order to identify customer order flow.
- **Registered Investment Advisor (RIA)**: You introduce customers to Alpaca, own the user experience, and Alpaca manages account approval and compliance. Order allocation and advisory fee calculation are not built-in yet.

See https://docs.alpaca.markets/docs/use-cases for details and compliance requirements.

You are to implement features for **GenEric TraDer AI** — a trading app using Alpaca Markets API (paper/demo mode) and internal simulation to allow users to buy/hold positions with virtual funds.

# Core Requirements
- Support **two modes**: Alpaca Paper API (real market data, paper trades) and Internal Simulator (fully virtual).
- Allow any initial virtual capital amount.
- Core features: 
  Overview, Bots, Strategies, Signal Builder, Backtest, Savings Calculator, Compound Interest, Inflation Calculator, Retirement Calculator, Portfolio, Financial Calculators (Compound, Savings, Retirement, Mortgage, Inflation, Debt Payoff, Fee Impact), Trading Calculators (Risk/Reward, Position Size, Leverage, Pivot Points, Spread, Options Greeks), Monte Carlo Simulator, Bot Manager, Alpaca API Integration.
- UI/UX: show “Demo Mode — simulated data” banner for demo/paper mode. Disable live trading unless plan is upgraded.

# Architecture Guidelines
- **Frontend**: React SPA with Tailwind styling.
- **Backend**: Bun/Node/Deno REST API mediating between frontend and Alpaca/simulator.
- **Database**: PostgreSQL for persistence, Redis for cache, optional Timescale/Influx for time-series.
- **Worker Queue**: BullMQ or similar for strategy execution & backtest jobs.
- **Market Data**: Alpaca REST for historical bars; WebSocket for live data.

# Data Models
- User, Integration, Account, Portfolio, Order, Bot, Strategy, BacktestResult, Signal.
- All sensitive credentials stored encrypted (AES-GCM) and never in client code.

# Backend Endpoints
- `/api/connect/oauth` — initiate Alpaca OAuth.
- `/api/integrations/apca` — save Alpaca API keys (encrypted).
- `/api/account`, `/api/portfolio`, `/api/orders`, `/api/positions` — portfolio management.
- `/api/backtest` & `/api/backtest/:id` — run and fetch backtest results.
- `/api/bots` CRUD + lifecycle actions.
- `/api/marketdata/history` — proxy historical bars.
- WebSocket `/ws/market` — server-pushed live data.

# Trading Engine
- Support multiple bot types: Buy/Hold, Signal-based, Rebalancer, Alpaca-connected, Simulated.
- Signal Builder: visual + code DSL with common TA indicators.
- Backtest engine: runs strategy on Alpaca historical bars with adjustable slippage/fees.

# Calculators
- Implement formulas for: Savings, Compound Interest, Inflation, Retirement, Risk/Reward, Position Size, Leverage, Monte Carlo simulation, Options Greeks.
- Return JSON results to frontend; use Chart.js/Recharts for visual output.

# UI Components
- Dashboard Overview, Portfolio, Market Data pages, Order Modal.
- Bots/Strategies manager, Backtest Studio, Signal Builder.
- Calculator suite.
- Settings/Integrations page with API key management and environment toggle.

# Alpaca Integration Notes
- Paper API: https://paper-api.alpaca.markets
- REST Endpoints:
  - `GET /v2/account` — account info
  - `GET /v2/positions` — positions
  - `POST /v2/orders` — place order
  - `GET /v2/orders` — list orders
- WebSocket: `wss://paper-api.alpaca.markets/stream` for account/order updates.
- Use Alpaca Market Data API for historical bars.

# Implementation Rules
- Always gate live trading by `plan_level` check.
- All environment URLs configurable (`PAPER_API_URL`, `LIVE_API_URL`).
- Backtests run in background workers; results persisted in DB.
- Unit test all trading logic, backtest fill rules, and API integrations.

# Output Format for This Prompt
When I use this .instructions file, output should:
1. Read these requirements.
2. Generate the requested component, API route, DB migration, or integration code according to spec.
3. Use the correct Alpaca endpoint and authentication method.
4. Follow best practices for security, performance, and maintainability.


You are building a full-stack trading dashboard web application called **Virgin Fund** with integrated AI trading, backtesting, calculators, and market data. The UI must be clean, modern, responsive, and dark-mode enabled with Tailwind CSS. The backend uses Node.js (Bun or Express), TypeScript, Prisma ORM, and PostgreSQL. Data sources include Alpaca Markets API for live trading, and simulated data mode for demo environments.

## Core Features:
- Theme toggle (light/dark)
- User authentication (Supabase or JWT)
- "Virgin Fund" AI trading engine integration
- Overview dashboard
- Custom Signals builder
- Signal Builder
- Backtest module
- Savings Calculator
- Compound Interest Calculator
- Inflation Calculator
- Retirement Calculator
- Portfolio tracking
- Financial Calculators (compound interest, savings, retirement, mortgage, inflation, debt payoff, fee impact)
- Trading Calculators (risk/reward, position size, leverage, pivot points, spread, options greeks)
- Monte Carlo simulator
- Bots manager
- Strategies manager
- Performance analytics
- Live Market Data grid/list views with symbol search and refresh
- API Configuration panel (demo/live)
- Bot Types distribution chart
- Recent Activity log
- Recent Orders table

## Requirements:
- All API calls go through a backend proxy for security.
- Use React Query for frontend data fetching and state.
- Use Chart.js or Recharts for data visualizations.
- Each section is its own route and React component, with modular `.instructions` prompts available for regeneration.
- Include a TESTING mode flag to unlock all features without limits.
- UI must support mobile, tablet, and desktop.

Deliver:
- Full backend code with routes, controllers, models, DB schema.
- Full frontend React code with pages, components, hooks, and queries.
- Instructions for deploying via Docker Compose (backend + frontend + DB).
- Seed data for demo mode (fake market data, bots, trades).
- Integrations with Alpaca Markets API (live and paper trading modes).
- Authentication with role-based access control.


