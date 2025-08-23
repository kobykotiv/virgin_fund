# TASKS — Backtest & Performance Dashboard

Summary
- Goal: finish Backtest features and deliver a robust Performance & Analytics dashboard, resolve TypeScript compilation errors, and prepare the codebase for tests and persistence decisions.

Roadmap / Checklist
- [x] Analyze requirements and existing implementation (Backtest UI, PerformanceDashboard, charts, server routes)
- [x] Fix PerformanceDashboard immediate issues
  - [x] Replace missing `strategyName` usage with `botName` in trades flattening
  - [x] Replace incorrect Button usage with `buttonVariants(...)` or proper Button API
- [x] Fix next-auth getServerSession typing in alpaca routes
  - [x] Replace `getServerSession(authOptions)` with `getServerSession()`
- [x] Add market-data cache proxy methods required by API routes
- [x] Extract and wire BacktestCharts and ComparisonPanel into BacktestResults
- [ ] Run full type-check (bun tsc --noEmit) and collect current error list
- [ ] Fix blocking TypeScript errors in test helpers and scripts (Cannot find module / missing stubs)
- [ ] Fix Recharts typing mismatches in `components/ui/chart.tsx` and `components/performance/*`
- [ ] Repair missing helper functions / imports in `lib/indicators` and `services/backtest-service.ts`
- [ ] Address middleware cookie typing (middleware/authMiddleware.ts)
- [ ] Re-run type-check and iterate until zero TypeScript errors
- [ ] Add / update unit tests for changed components (Vitest)
- [ ] Decide persistence for backtests (Supabase migrations) — request explicit approval before migrations
- [ ] Add CSV/PDF export support (request approval before adding jsPDF/html2canvas)
- [ ] Final QA: run app locally, verify PerformanceDashboard flows, charts and export
- [ ] Create PR with summary of changes and migration or dependency notes

---

## [2025-08-23] CoinGecko & Alpaca Market Data Integration

- Backend `/api/market-data` merges CoinGecko (altcoins) and Alpaca (mainstream/equities) prices, annotating each asset with its data source.
- `useMarketData` hook fetches merged, source-annotated data for any asset list.
- UI (`AdvancedView`) displays the data source per asset; other views can easily extend this.
- Integration is architecturally complete and ready for live data.

**Next Steps:**
1. Extend bot CRUD UI for strategy/asset assignment and cloning.
2. Implement watchlist CRUD and alert logic.
3. Build trade history and performance chart views in `ExpertView`.
4. Polish UI/UX with animation and accessibility improvements.

**Summary of Changes:**  
- Integrated CoinGecko and Alpaca APIs for unified, source-annotated market data.
- Updated UI to display asset data sources.
- Use Bun and PowerShell for commands (per .clinerules). Do not run migrations or install heavy deps without approval.
- Prioritize TypeScript errors that block compilation first (test stubs, chart typings, service helpers).
- Keep changes small and targeted; prefer replace_in_file style edits for existing files.
