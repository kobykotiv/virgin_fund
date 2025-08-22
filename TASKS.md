# TASKS — Updated 2025-08-21 20:49 EDT

Progress summary:
- Conversion script executed to replace `Badge variant=` -> `Badge className=` (29 files).
- Automated merges executed (simple + advanced) to collapse duplicate `className` attributes (updated ~17 files).
- Type-check executed (`bun tsc --noEmit`) after merges — TypeScript now reports 71 errors across 37 files.
- Top remaining categories: domain type mismatches (BotStatus, backtest/indicator signatures), test type/run issues (bun:test, jest mocks), missing exports/imports, some lingering JSX attribute issues, and incorrect value types (e.g., toFixed on possible strings).

Checklist
- [x] Analyze requirements
- [x] Implement Supabase clients and env assertions (lib/env.ts, lib/supabaseClient.ts, lib/supabaseAdmin.ts)
- [x] Implement server-side encryption (lib/crypto.ts)
- [x] Create server API routes for api-keys and bots (app/api/api-keys, app/api/bots)
- [x] Create React Query hooks (hooks/useApiKeys.ts, hooks/useBots.ts)
- [x] Update core components to use hooks (api-key-form, DashboardSupabase, bot-management) — partial
- [x] Install class-variance-authority dependency and adjust UI primitives
- [x] Create conversion script to replace `Badge variant` -> `className` (`scripts/convert-badge-variant-to-classname.js`)
- [x] Run conversion script (updated 29 files)
- [x] Create simple merge script to collapse duplicate `className` (`scripts/merge-duplicate-classname.js`)
- [x] Create advanced merge script for expression/literal combinations (`scripts/merge-duplicate-classname-advanced.js`)
- [x] Run merge scripts (merged duplicates across multiple files)
- [x] Run TypeScript check (`bun tsc --noEmit`) — executed; diagnostics captured
- [ ] Triage and fix top TypeScript errors (priority list below)
- [ ] Re-run typecheck and iterate until green
- [ ] Wire remaining components to React Query hooks (complete bot-management, strategies, pages)
- [ ] Add unit tests:
  - [ ] lib/crypto.ts (encrypt/decrypt/hash)
  - [ ] API route tests for api-keys and bots (mock supabase admin & lib/session)
- [ ] Remove Firebase and leftover mock-data
- [ ] Add RLS policies under `supabase/policies/` and verify migrations
- [ ] Implement server-only secret reveal worker helper (uses decryptSecret) — server-only, not exposed to clients
- [ ] Update PROGRESS.md / commit changes

Immediate prioritized fixes (next actions)
1. Fix remaining duplicate JSX attribute error locations flagged by tsc (manually merge or inspect where automated merges didn't cover).
2. Address domain/type mismatches:
   - Ensure BotStatus uses typed enum/union in tests and fixtures.
   - Fix indicator/backtest function names and signatures (calculateEMA/RSI/MACD/Bollinger).
   - Ensure value types for numeric APIs (toFixed on number).
3. Test/type environment fixes:
   - Replace or shim `bun:test` usage in tests (use Vitest / jest types).
   - Fix mocked next/router types to satisfy `AppRouterInstance`.
4. Resolve missing scripts/imports referenced by tests (process_backtests, migration_runner) or add type stubs.
5. Re-run `bun tsc --noEmit` and iterate.

If you approve, next automated step I will run:
- A targeted patch pass to fix the specific JSX files still flagged by tsc (merge or manually update), then re-run `bun tsc --noEmit` and return the updated diagnostics and a prioritized patch list for domain/type fixes.
