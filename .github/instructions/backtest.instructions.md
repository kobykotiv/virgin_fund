Build a "Backtest" module for the Virgin Fund trading app. This page lets users select:
- Strategy (from saved strategies list)
- Date range (start/end)
- Symbols (multi-select)
- Initial capital
- Position sizing rules
- Transaction costs (slippage, commission)

Run the backtest via backend API:
- Backend retrieves historical market data (Alpaca or simulated).
- Apply strategy logic and return results (equity curve, trades list, performance metrics).
- Return JSON with metrics: CAGR, Sharpe, Max Drawdown, Win Rate, Avg Trade P/L, Total Return.

Frontend:
- Inputs in a form (react-hook-form)
- On submit → call backtest API
- Show results in:
  - Line chart (equity curve)
  - Stats cards
  - Trades table (sortable)
  - Export to CSV

Tech:
- Backend: Node.js, TypeScript, Prisma, Alpaca API wrapper
- Frontend: React, Tailwind CSS, React Query, Chart.js
