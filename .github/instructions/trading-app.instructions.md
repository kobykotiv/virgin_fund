---
applyTo: '**/*.tsx'
---

# Trading Bot Dashboard Refactor Prompt

## Tech Stack
- React (TypeScript, client components)
- TailwindCSS for styling
- lucide-react / react-icons for icons
- Storybook (if possible)
- Supabase auth + Firestore (future backend, use mocks if missing AND ENV approves)
- Bun runtime (but frontend-only for this task)

## Pages to Implement

### 3) Backtest Page
- File: `components/pages/Backtest.tsx`
- UI:
  - Form: strategy selector, asset ticker, date range, initial capital
  - "Run Backtest" button
- Results:
  - Collapsible metrics panel
  - Interactive chart placeholder
- History table: list of past runs

### 4) Financial Calculators
- File: `components/pages/FinancialCalculators.tsx`
- Layout: left nav selectors, right panel
- Calculators: Compound interest, Inflation, Savings
- Results: styled with `text-indigo-400`

### 5) Trading Calculators
- File: `components/pages/TradingCalculators.tsx`
- Calculators: Risk/Reward, Position Size, Leverage, Pivot Points
- Results emphasis: **bold**

### 6) Strategy Builder
- File: `components/pages/StrategyBuilder.tsx`
- UI: Multi-step / collapsible interface to add Entry/Exit signals (RSI, MA crossover)
- Real-time summary panel
- Buttons: Save & Export JSON

### 7) Portfolio Page
- Ensure `app/portfolio.tsx` renders:
  - `DashboardLayout`
  - `components/pages/PortfolioOverview` (reuse existing)

## Navigation & Layout
- Sidebar (`components/layouts/Sidebar.tsx`):
  - ~250px width, dark theme
  - Responsive collapse → hamburger on small screens
  - Multi-level nested nav (3–4 levels)
  - Icons via lucide/react-icons
  - Smooth expand/collapse, animated slide-out for mobile
  - Canonical routes:  
    `/`, `/overview`, `/portfolio`, `/backtest`,  
    `/calculators/financial`, `/calculators/trading`,  
    `/strategies/builder`, `/bots`

- Topbar/Header:
  - User menu with "Log off" → `/logout`
  - Calls server logout, then redirect

- DashboardLayout:
  - Wraps all pages
  - Detects auth state
  - Calls `runAuthLifecycle()` only after successful login/redirect (debounced/throttled)

## Hooks & Data Integration
- `useBots()`: load bots, expose start/pause/stop mutations; handle loading/error
- `useAuthLifecycle()` / `runAuthLifecycle()`: ensure refresh is throttled/deduped (30s)
- `useMarketData()`: consume `/api/coingecko/prices` + `/api/alpaca/prices` (mock if missing)
- `useBacktests()`, `useApiKeys()` placeholders

## UX / Polish
- Hover/active glowing indigo accents for nav/buttons
- Smooth transitions (accordion, expand/collapse)
- Toasts / inline confirmations for bot actions
- Forms: client-side validation + error handling
- Focus management on errors

## Testing & Deliverables
- Unit/smoke tests:
  - BotArmyOverview: loading/empty/error states, bulk ops
  - Sidebar: expand/collapse, route navigation
  - Auth flows: ensure lifecycle only after login
- Provide Storybook stories or demo pages where possible

## APIs / Mocks
- Expected endpoints:
  - `GET /api/alpaca/keys`, `POST /api/alpaca/keys`
  - `GET /api/coingecko/prices`
  - `GET /api/navigation` (fallback to static)
  - `GET /api/bots`
  - `POST /api/auth/login|register|logout`
- If missing: implement mocks in `src/mocks`

## Constraints
- Frontend-only: no server modifications
- Components small, typed, isolated
- Preserve repo structure/naming
- THESE NaN% → seed as `0%` for progress metrics

## Acceptance Criteria
- All pages above implemented and routed
- Sidebar + Topbar integrated, responsive
- BotArmyOverview fully functional (filter, search, pagination, bulk actions)
- Auth refresh only after login, throttled
- Consistent Tailwind UI polish
