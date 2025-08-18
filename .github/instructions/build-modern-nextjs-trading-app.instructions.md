# Build a modern, fast trading app (Next.js + Supabase + Alpaca)

This document lists step-by-step notes and instructions to turn the demo frontend into a production-ready fullstack trading app, deploy a Supabase Edge Function (`run-bots`), schedule it, and prepare the project for alpha → beta → MVP → releases.

Keep this file as the single source of truth for DevOps + release tasks and developer onboarding.

---

## 1) Quick summary
- Tech: Next.js (TypeScript), Supabase (auth + Postgres + Edge Functions), Alpaca adapter, Prisma optional, SWR, Tailwind, Recharts.
- Runtime: serverless (Vercel/Edge) for frontend, Supabase Edge Functions for background jobs, optional worker (Cloud Run / Fly / DigitalOcean) for heavier tasks.
- Release flow: trunk-based + short-lived feature branches → CI checks → preview deploys → staging → production.

---

## 2) Deploy `run-bots` Edge Function (supabase functions)
Create a Supabase Edge Function that executes scheduled DCA/stop-loss checks and triggers orders (paper/mock by default).

1. Create function scaffold in repo:
   - Path: `supabase/functions/run-bots/index.ts`
   - Minimal stub:
     ```ts
     // supabase/functions/run-bots/index.ts
     import { serve } from 'std/server';
     import adapter from '/lib/alpaca'; // import built adapter (adjust build path)

     serve(async (req) => {
       // authenticate using service_role key in headers or use server runtime env
       // fetch bots to run, evaluate stop-loss, place orders (adapter.placeOrder)
       return new Response(JSON.stringify({ ok: true }), { status: 200 });
     });
     ```

2. Local test:
   - Install Supabase CLI: `npm i -g supabase` or follow https://supabase.com/docs
   - Run locally: `supabase functions serve run-bots` (from repo root)

3. Build & deploy (PowerShell example):
   - Login once: `supabase login`;
   - Deploy: `supabase functions deploy run-bots --project-ref $env:SUPABASE_PROJECT_REF`
     - If you don't have `SUPABASE_PROJECT_REF` set, supply your project ref or omit to use default.

4. Environment variables for function:
   - Set in Supabase dashboard or via CLI: `supabase secrets set ALPACA_KEY=... ALPACA_SECRET=... SUPABASE_SERVICE_ROLE_KEY=...` (use secrets manager)
   - Ensure service role key is only available to server-side functions.

5. Validate:
   - Call function endpoint with service role header or signed request and confirm logs in Supabase dashboard.

---

## 3) Schedule `run-bots`
Two recommended approaches. Use the safest for you.

Option A — Supabase Scheduler (recommended if available in your project):
- If your Supabase tier exposes a scheduler UI/feature, create a scheduled job that invokes the function URL every day at 09:00 UTC (or local timezone). Use a POST and include a short-lived token or service-role header.
- Example schedule: `0 9 * * *` (daily at 09:00). Use cron expression when configuring the scheduled job in dashboard.

Option B — GitHub Actions cron (portable, free):
- Create `.github/workflows/schedule-run-bots.yml` with a scheduled job that calls the function HTTP endpoint using the service role key as an auth header.

Example workflow snippet:
```yaml
name: scheduled-run-bots
on:
  schedule:
    - cron: '0 9 * * *' # daily at 09:00 UTC
jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - name: Call run-bots function
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
        run: |
          curl -X POST "$SUPABASE_URL/functions/v1/run-bots" \
            -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
            -H "Content-Type: application/json" \
            -d '{}'
```

Notes:
- GitHub Actions gives you easy auditing and retry built-in.
- Keep the service role key in GitHub Secrets and rotate periodically.

---

## 4) Transform demo frontend into fullstack app (practical checklist)
1. API & Server
   - Finalize Next.js API routes (or App Router server functions) that mirror Supabase operations you need (bots CRUD, execute, backtest, settings, webhooks).
   - Move heavy tasks to Edge Functions (run-bots) or background workers — keep API lightweight.
   - Ensure server-only code uses service role key via environment variables.

2. Auth
   - Wire Supabase Auth on frontend using `supabase.auth` hooks.
   - Protect server endpoints: validate JWT on each request and scope queries to `user.id`.

3. Data models & migrations
   - Keep `supabase/schema.sql` in repo and apply migrations to staging + prod as part of CD.
   - Use typed DB client generation (Supabase types generation or Prisma if you prefer) and keep types committed or generated in CI.

4. Trading adapters
   - Keep adapter pattern: `mock | official (SDK) | axios` selectable by `NEXT_PUBLIC_ALPACA_MODE`.
   - Default to `mock` for dev and `paper` for staging.
   - Require explicit feature-flag and developer-mode + confirmation for `live`.

5. Backtest engine & audit
   - Move simulation to server-side module with unit tests.
   - Persist backtest results to `backtests` table.
   - Store order events to `order_records` table.

6. UI & UX
   - Build pages: Dashboard (BotManager), Bot Details (positions/backtests), Settings (developer-mode), Onboarding (connect Alpaca keys), Safety modals (confirm destructive actions).
   - Use feature flags to hide dangerous actions by default.

7. Testing
   - Unit tests for backtest, adapter behavior.
   - Integration tests for API routes (msw for external), and E2E smoke tests (playwright / cypress) for critical flows.

8. Observability
   - Add structured logs, Sentry for errors, basic metrics (Prometheus/Datadog or serverless provider), and create dashboards for execute errors and backtest durations.

---

## 5) DevOps & release checklist (alpha → beta → MVP)
Follow the earlier `devops.instructions.md` but use this checklist to ensure readiness for each stage.

Alpha (internal):
- Core features implemented (auth, bots CRUD, mock execution, backtest)
- Unit tests and basic CI passing
- Supabase functions deployed to staging
- Internal runbook & monitoring set up

Beta (limited external):
- Paper trading stable, backtest validated
- Monitoring & alerting in place
- Selected users added to onboarding flow

MVP (public):
- Live trading behind explicit gates and audited deploys
- Full test coverage on critical flows
- Backups & rollback procedures tested

Release steps (for each release):
1. Create release branch `release/x.y.z` from `develop`.
2. Run full CI (lint, types, tests, e2e smoke) — block merge on failures.
3. Deploy to staging and run smoke tests.
4. Run DB migrations on staging and test data integrity. Snapshot DB before prod migration.
5. Tag and push release; run `supabase functions deploy` for functions and deploy to production hosting.
6. Post-deploy smoke test and monitor error rates for the first 24 hours.

---

## 6) Operational notes & security
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to client-side. Use it only in Edge Functions and server-side code.
- Require `X-Confirm-Live` header + admin role + `developer_mode=true` before allowing real-money orders.
- Use idempotency keys and persist them (we added `idempotency_keys` table).
- Replace in-memory rate limiter with Redis for horizontal scaling.
- Add webhook signature verification for Alpaca webhook endpoints.

---

## 7) Onboarding checklist for devs (quick)
1. Clone repo and run `npm i` or `bun i`.
2. Create `.env.local` with keys: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ALPACA_KEY`, `ALPACA_SECRET`, `NEXT_PUBLIC_ALPACA_MODE=mock`.
3. Start Supabase locally (optional): `npx supabase start` and apply SQL: `psql $SUPABASE_DB_URL -f supabase/schema.sql`.
4. Start app: `npm run dev` or `bun dev`.
5. Deploy run-bots function: `supabase functions deploy run-bots`.
6. Configure scheduled job (Supabase or GitHub Actions) to call the function.

---

## 8) Example commands (PowerShell)
- Deploy function:
  ```powershell
  supabase login;
  supabase functions deploy run-bots --project-ref $env:SUPABASE_PROJECT_REF
  ```
- Serve locally:
  ```powershell
  supabase functions serve run-bots
  ```
- Call function (test):
  ```powershell
  curl -X POST "$env:NEXT_PUBLIC_SUPABASE_URL/functions/v1/run-bots" -H "Authorization: Bearer $env:SUPABASE_SERVICE_ROLE_KEY" -H "Content-Type: application/json" -d '{}'
  ```
- GitHub Actions schedule (see sample earlier)

---

## 9) Files to add to repo (short list)
- `supabase/functions/run-bots/index.ts` (Edge function code)
- `.github/workflows/ci.yml` (CI tests)
- `.github/workflows/schedule-run-bots.yml` (optional scheduled runner)
- `ops/runbook.md` (run/rollback procedures)
- `infra/redis-limiter/README.md` (how to provision Redis)

---

## 10) Final notes
- Prioritize safety: default all modes to `mock` and `paper` while developing. Do not enable `live` until you have review, testing, and runbooks.
- Automate everything you can (CI, deploy, rollbacks). Keep deploy steps in scripts and documented.

If you want, I can now:
- Generate `supabase/functions/run-bots/index.ts` stub in this repo, deploy script, and GitHub Actions schedule workflow.
- Add CI workflow templates and a simple `ops/runbook.md` file.

Which of those should I create now? 
