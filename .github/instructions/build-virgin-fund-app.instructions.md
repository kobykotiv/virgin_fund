Read the full requirements in `virgin-fund.instructions`.

Using those requirements:
1. Scaffold a production-ready full stack application called **Virgin Fund : GenEric TraDer AI**.
2. Implement:
   - Backend (Bun/Node/Deno + Express/Koa/Fastify)
   - PostgreSQL DB schema + migrations for all models in the instructions
   - REST API + WebSocket layer
   - Frontend (React + Tailwind + React Query) with pages/components for all sections
   - Worker system (BullMQ or similar) for backtests & bots
3. Integrate Alpaca Paper API according to their docs:
   - `/v2/account`, `/v2/orders`, `/v2/positions`, Market Data API, WebSocket streaming
4. Include:
   - Dockerfile + docker-compose.yml for DB, backend, frontend
   - `.env.example` with all variables
   - Unit tests for trading logic and backtest engine
   - README with setup and usage instructions
5. Ensure:
   - Live trading is disabled for Free plan
   - Demo Mode uses internal simulation
   - Theme toggle and dashboard mode are persisted per user
   - All calculators return both numeric results and chart data
6. Deliver:
   - `/backend` — API, workers, DB
   - `/frontend` — pages, components, hooks
   - `/shared` — constants, utility functions
   - Ready for `docker compose up`
