# Core Features for Virgin Fund

1. **User Management & Auth**: Supabase auth with email/password, OAuth (Google), role-based access (free/starter/pro/boss). Multi-tenant with RLS policies.
2. **Bot Creation & Management**: Drag-and-drop strategy builder (grid, momentum, RSI, etc.), parameter tuning, version control. Support for custom scripts (Python/JS).
3. **Backtesting Engine**: Integrated with historical Alpaca data; Monte Carlo simulations, performance metrics (Sharpe, drawdown), charts via Chart.js/Recharts.
4. **Live Trading**: Paper mode by default; live mode with risk controls (max loss, position sizing). Real-time order execution and reconciliation.
5. **Social Trading**: Follow leaders, copy trades (simulated or live), community feed with posts/signals, leaderboards by return/win rate.
6. **Market Data & Analytics**: Real-time Alpaca feeds, watchlists, technical indicators, portfolio P&L tracking.
7. **AI Assistance**: GPT-4 integration for strategy suggestions, risk analysis, and automated bot optimization.
8. **Billing & Subscriptions**: Stripe integration with tiers (free: 1 bot, pro: unlimited), usage-based pricing for API calls.
9. **Admin Panel**: For "boss" role: user management, analytics, system monitoring.
10. **Mobile/Web App**: Responsive design with PWA support; optional React Native mobile app.
