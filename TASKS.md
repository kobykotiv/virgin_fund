# Current Implementation Tasks — Bots Manager & Strategies

- [x] Inspect existing Bots Manager, BotForm, and BotMainView
- [x] Wire Create Bot modal to useCreateBot via BotForm.onSubmit
- [x] Add Edit Bot modal and wire updateBot.mutateAsync
- [x] Add "Configure" button in BotMainView to emit edit action
- [x] Add Framer Motion enter/exit animation for bot cards and modals
- [x] Add Vitest test scaffold for create/update/delete flows

- [ ] Expand unit tests:
  - [ ] Assert toast calls and router.refresh behavior
  - [ ] Test delete flow and confirmation dialog
  - [ ] Add coverage for subscription tier restrictions in BotForm

- [ ] Fix any remaining TypeScript prop issues discovered in CI

- [ ] Strategies & Signal Builder — backend
  - [ ] Add supabase migration: `supabase/migrations/YYYYMMDD_add_strategies_table.sql`
  - [ ] Implement API routes: `app/api/strategies/route.ts` and `app/api/strategies/[id]/route.ts`

- [ ] Strategies & Signal Builder — frontend
  - [ ] Implement `components/strategies/StrategyList.tsx` and `StrategyCard.tsx`
  - [ ] Extend `components/signal-builder.tsx` for save/import/export
  - [ ] Add "Save as Strategy" flow that POSTs to /api/strategies
  - [ ] Add sharing/import (public flag or tokenized link)

- [ ] UX polish
  - [ ] Add hover elevation and micro-interactions for bot cards
  - [ ] Improve modal accessibility (focus trap, ESC to close)
  - [ ] Add visual indicators for bot status and P&L (animated badges)

- [ ] QA & Verification
  - [ ] Run unit tests (vitest) and fix failures
  - [ ] Start dev server and manually verify modals, animations, and builder UX
  - [ ] Add PROGRESS.md summary and docs for strategy JSON shape

Notes:
- I will follow project .clinerules for DB migrations, API routes, and testing.
- Request explicit approval before running dev server or installing packages.
