# Architecture Overview - Portfolio Manager (Alpaca integration)

Components:
- Frontend: React/Next app with connect popup and portfolios dashboard.
- API Layer: Next.js server routes that handle OAuth token exchange and act as a proxy to Alpaca when needed.
- Persistence: DB tables for `alpaca_tokens`, `portfolios`, `trades`, `strategies`.
- Strategy Engine: Backtest and live execution components that consume signals and create idempotent orders.
- Risk & Order Manager: Central service enforcing per-order and portfolio-level risk limits before sending orders to Alpaca.
- Observability: Logs, metrics, and alerts for trade failures and API errors.

Data Flow:
1. User connects Alpaca via OAuth popup.
2. Server exchanges code and stores token.
3. User creates portfolio using Alpaca capital; server reads account cash and seeds portfolio.
4. Strategy engine schedules rebalances and order manager places orders through server-side Alpaca proxy.

Security
- Tokens encrypted at rest; secrets in secret manager.
- Use paper environment for testing; opt-in for live trading.
