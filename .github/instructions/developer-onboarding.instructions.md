# Developer onboarding (quick start)

Purpose
- Fast ramp for engineers to run and contribute to the project locally and in CI.

Prerequisites
- Node.js (LTS), Bun optional; pnpm preferred if used in CI.
- Supabase CLI (`npm i -g supabase`), psql or pg cli for local DB work.
- Recommended: VS Code with TypeScript and Prettier extensions.

Local setup
1. Clone and install
   - git clone <repo>
   - cd repo
   - bun i || pnpm install || npm install
2. Environment
   - Copy `.env.sample` to `.env.local` and fill values:
     - NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
     - SUPABASE_SERVICE_ROLE_KEY (server-only)
     - NEXT_PUBLIC_ALPACA_MODE=mock
     - ALPACA_KEY, ALPACA_SECRET (optional for paper/live)
3. Start local Supabase (optional)
   - npx supabase start
   - psql $SUPABASE_DB_URL -f supabase/schema.sql
4. Run app
   - npm run dev || bun dev

Key developer flows
- Feature work: create `feature/<short-desc>` branch; open PR into `develop` and assign reviewer.
- DB changes: add SQL migration under `supabase/migrations/` and include a small README describing intent.
- Edge functions: add code under `supabase/functions/` and test with `supabase functions serve`.

Testing
- Unit: run `pnpm test` or `npm test` for isolated logic (backtest, adapters).
- Integration: use Supabase test instance or test DB; mock external HTTP with MSW.
- E2E: add Playwright or Cypress for critical flows; keep a minimal smoke test in CI.

Code style & QA
- Follow TypeScript strict typings and prefer server-side logic for sensitive work.
- Run `pnpm lint` and `pnpm format` before PRs.
- Add changelog entry for every public-facing change.

Secrets & safety
- Never commit `.env.local` or secrets. Use GitHub Secrets for CI and Supabase secrets for functions.
- Keep `NEXT_PUBLIC_ALPACA_MODE=mock` as default for local dev.

Where to find things
- Supabase schema: `supabase/schema.sql`
- Edge functions: `supabase/functions/`
- Migrations: `supabase/migrations/`
- CI workflows: `.github/workflows/`
- Ops runbook: `ops/runbook.md` (create if missing)

If you want, I can add a `.env.sample` and a minimal `ops/runbook.md` next.
