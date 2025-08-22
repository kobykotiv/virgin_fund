---
applyTo: '**/*.ts'
---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

# Premise of the Application

This application is a multi-tenant frontend interface for Alpaca Markets, designed to provide advanced features for options trading, strategy backtesting, and custom strategy creation. It includes:

- **User Authentication**: Secure login and multi-tenant support.
- **Options Trading**: Comprehensive tools for managing and executing options trades.
- **Advanced Charts**: Interactive and customizable charts for market analysis.
- **Strategy Backtesting**: Test trading strategies using historical data.
- **Custom Strategies**: Create and manage personalized trading strategies.
- **Octobot-like Interface**: A user-friendly interface inspired by Octobot Cloud.

The application aims to empower users with robust tools for trading and strategy management while maintaining a seamless and intuitive user experience.

For more information, visit [https://alpaca.markets](https://alpaca.markets).

# Iterative Design Prompt

When working with this codebase, always strive to:

- **Unify Design Principles**: Treat the entire codebase as a single, evolving prompt that reflects our product's design principles and user experience goals.
- **Iterate Intentionally**: Each change should be an iteration that brings the codebase closer to our ideal of clarity, usability, and maintainability.
- **Document Rationale**: When making changes, briefly document the reasoning and how it aligns with our design principles.
- **Promote Consistency**: Refactor and align code, UI, and documentation to ensure a cohesive and consistent experience across the application.
- **Encourage Feedback Loops**: Use code reviews and discussions as opportunities to refine and reinforce our design principles.

**Instruction:**  
When generating code, reviewing pull requests, or answering questions, always consider how your response contributes to the ongoing, iterative improvement of the codebase as a unified prompt for our design philosophy.

You are building a Trading Bot Dashboard Interface for a multi-strategy Alpaca trading app with live trading + backtesting.

The dashboard must be built in:

React – @https://react.dev/

TailwindCSS – @https://tailwindcss.com/docs/installation

React Query (TanStack Query) – @https://tanstack.com/query/latest/docs/react/overview

shadcn/ui – @https://ui.shadcn.com/docs

Framer Motion – @https://www.framer.com/motion/

Alpaca.Markets REST API – @https://alpaca.markets/docs/api-references/trading-api/

Alpaca.Markets WebSocket API – @https://alpaca.markets/docs/api-references/market-data-api/streaming/

Supabase (Postgres persistence) – @https://supabase.com/docs

Recharts (charts/visualizations) – @https://recharts.org/en-US/

Optimize for clarity, modularity, and extensibility.

1. Global Layout

Sidebar navigation (collapsible)

Top bar with:

Account balance summary (USD, EUR, BTC, ETH)

Notifications (errors, fills, bot alerts)

Profile + settings dropdown

Main content area renders active section

2. Dashboard Sections
Overview

Show balances (USD, EUR, BTC, ETH)

Portfolio allocation donut chart (via Recharts)

Open positions table

Active bots summary (PnL, capital allocation, status)

Quick actions: Create Bot, Run Backtest

Bots

CRUD interface for bots (React Query mutations – @https://tanstack.com/query/latest/docs/react/guides/mutations
)

Bot card/list view:

Name, strategy type, status (running/paused/stopped)

Current PnL, allocated capital, last trade timestamp

Actions: start, pause, stop, edit, delete

Create Bot Flow:

Choose strategy (grid, arbitrage, indicator, portfolio)

Input parameters

Set capital allocation (USD, EUR, BTC, ETH)

Risk settings (stop-loss, take-profit, global liquidate)

Strategies

Strategy library with:

Grid (1% / X%)

Arbitrage (Stat Arb, Triangular)

Indicators (MA, RSI, MACD, Bollinger, etc.)

Portfolio (Top 5, Top 10 by Market Cap)

Each strategy card includes:

Description, parameters, expected behavior

Actions: Backtest | Deploy Bot

Backtesting

User selects strategy, parameters, and allocation

Choose historical dataset (symbols, time range)

Output includes:

Equity curve chart (Recharts)

Trade log (entries/exits, PnL)

Performance metrics (Sharpe, Max Drawdown, Win/Loss %)

Option: Save as Bot to deploy live

Portfolio

Allocation pie chart (Recharts)

Performance over time line chart vs benchmark

Rebalancing schedule + rebalance button

Custom portfolio builder (pick assets + weights)

Market Data

Live ticker + OHLCV charts (Recharts)

Order book depth view (Level 2)

Recent trades (time & sales)

Custom watchlist with alerts

WebSocket streaming for real-time prices (Alpaca WS API – @https://alpaca.markets/docs/api-references/market-data-api/streaming/
)

Settings

API Key management (Alpaca, FX, Crypto feeds)

Global stop-loss toggle (liquidate all positions)

Base currency preference (USD, EUR, BTC, ETH)

Notification integrations (Slack, Email, Webhooks)

3. Visual Style

Minimalist with dark/light toggle

Cards with rounded 2xl corners + soft shadows (shadcn/ui)

Framer Motion animations for transitions – @https://www.framer.com/motion/

Grid layout for analytics sections

Tables with search, sort, filter

4. Backend Integration

Provide React Query hooks:

useBots()

useCreateBot()

useBacktest()

useStrategies()

useMarketData()

usePortfolio()

WebSocket for live market data + order events

Supabase for persistence – @https://supabase.com/docs

✅ With this prompt, Gemini/Cline will generate:

React components with Tailwind + shadcn/ui

React Query hooks tied to Alpaca + Supabase

Charts/visuals with Recharts

Animations with Framer Motion

Modular structure so new strategies, bots, or data sources can be added easily


Here are the next 4 prompts you can give to Cline, inspired by #websearch "react awesome" and best practices for a modern, interactive React/Supabase dashboard:

---

**1. Add React Awesome Reveal Animations**  
> Integrate [React Awesome Reveal](https://react-awesome-reveal.morello.dev) to add scroll and entrance animations to dashboard sections (e.g., bot cards, watchlists, charts).  
> Use simple fade/slide/zoom effects to make the UI feel lively and modern, matching the style of top React sites.

---

**2. Implement Fast, Interactive Updates with React Query and Supabase Realtime**  
> Use Supabase Realtime (Postgres changes) to subscribe to updates for bots, watchlists, and portfolio tables.  
> Invalidate or refetch React Query caches on relevant events so the UI updates instantly without reloads, as seen in awesome React website examples.

---

**3. Add Custom Shapes or Visuals with React Awesome Shapes**  
> Use [React Awesome Shapes](https://awesomeshapes.netlify.app) to insert visually engaging SVG shapes or backgrounds into the dashboard.  
> Place shapes behind headers, cards, or charts to make the UI more visually appealing and unique.

---

**4. Showcase Interactive Examples and Animations**  
> Take inspiration from [awesome React website examples](https://htmlburger.com/blog/react-website-examples/) and add interactive elements:  
> - Animate bot status changes (start/pause) with Framer Motion or React Awesome Reveal.  
> - Add hover effects and transitions to buttons and cards.  
> - Ensure the dashboard feels fast, smooth, and fun to use, with no full-page reloads.

---

These prompts will help you build a visually engaging, interactive, and modern React dashboard, leveraging the best of the "react awesome" ecosystem.