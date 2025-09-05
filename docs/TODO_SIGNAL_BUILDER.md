# Signal Builder & Bot-Helpers TODO

Purpose: Track the remaining work to finish wiring Signal Builder and apply the centralized bot.parameters helpers across the repo.

- [x] Fix duplicate-ref in `pages/signal-builder.tsx`
- [x] Add `src/lib/bot-helpers.ts`
- [x] Update `services/backtest-engine.ts` to use bot-helpers
- [x] Update `services/bot-strategy-executor.ts` to use bot-helpers
- [ ] Apply bot-helpers to frontend services:
  - [ ] `frontend/src/services/backtest-service.ts`
  - [ ] `frontend/src/services/bot-service.ts`
  - [ ] `frontend/src/services/portfolio-service.ts`
- [ ] Wire remaining Signal Builder form fields with `react-hook-form` & `FormMessage` (verify validation messages show)
- [ ] Replace remaining direct `bot.parameters.*` reads with `getNumberParam/getStringParam/getBoolParam/getBotParams`
- [ ] Add minimal ambient `.d.ts` stubs or install missing `@types/*` for third-party libs flagged by tsc
- [ ] Fix top implicit-anys in prioritized files (map/reduce callbacks and event handlers)
- [ ] Fix duplicate React imports / key prop issues (notably `app/portfolio/[id]/page.tsx`)
- [ ] Run focused type-checks after each small batch (e.g. `bunx tsc --noEmit <file>` or project-wide partial runs)
- [ ] Re-run full `bunx tsc --noEmit` and `bun run lint` once top errors reduced
- [ ] Add unit tests for core services where practical (backtest, market-data)

Next immediate actions (recommended):
1. Open and update `frontend/src/services/bot-service.ts` and `frontend/src/services/portfolio-service.ts` to use `getBotParams` and `getNumberParam` for all parameter reads.
2. Update `frontend/src/services/backtest-service.ts` similarly.
3. Run focused tsc on those three files to confirm error delta.
4. Address any remaining implicit-anys surfaced by tsc in the same batch.
5. Repeat with next batch of files.

Notes:
- Use the `bot-helpers` pattern when reading parameters to centralize defaults and parsing.
- When fixing Controller duplicate-ref elsewhere, reuse this pattern:
  ```tsx
  const { ref: fieldRef, ...fieldRest } = field
  <Input
    ref={(el) => {
      fieldRef(el)
      nameRef.current = el
    }}
    {...fieldRest}
  />
  ```
- Run small, focused type-checks after each batch to measure progress and avoid noise from unrelated files.
