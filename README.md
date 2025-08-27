# Virgin Fund — Developer README

This repository contains the Virgin Fund Next.js + Bun project. See the project documentation inside PROGRESS.md and the full developer docs in CONVERSATION_SUMMARY.md.

Quick commands (PowerShell):

```powershell
bun install
bun dev
bun tsc --noEmit
bun test
# Seed demo data (writes to Supabase if configured, otherwise writes local fixtures)
npm run seed:dev
# Run e2e tests (requires Playwright + server running locally)
npm run e2e
```

Files added by the docs generator:
- `openapi.json` — basic OpenAPI description for the main endpoints
- `scripts/dev-seed.mjs` — seed script for dev/demo data
- `e2e/playwright.config.ts` + `e2e/tests/bots.spec.ts` — example Playwright test

Notes: Install Playwright browsers via `npx playwright install` if you plan to run e2e locally.
