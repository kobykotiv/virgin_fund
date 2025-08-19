Migration: add_last_trade_at

Purpose
- Adds `last_trade_at` column to `bots`, backfills it from `order_records`, and creates an index `idx_bots_last_trade_at`.

How to run locally (PowerShell)

1) Prepare a test Postgres database and set the connection URL:

```powershell
$env:TEST_DATABASE_URL = "postgres://user:pass@localhost:5432/virgin_fund_test"
```

2) Run the migration manually (psql):

```powershell
# Up
psql $env:TEST_DATABASE_URL -f .\supabase\migrations\20250818_add_last_trade_at.sql

# To run Down (rollback), re-run the same file but extract the Down block or manually run the Down statements.
```

3) Run the automated Jest migration test (uses TEST_DATABASE_URL):

```powershell
# Install dev deps if needed (example using npm/yarn/pnpm)
# npm ci

# Run jest for migrations
npx jest __tests__/migrations/add_last_trade_at.test.ts --runInBand
```

Notes & guidance
- The migration uses a single set-based UPDATE to backfill `last_trade_at`. On very large tables consider batching the update.
- Always run migrations against a staging/test DB before production.
- The test creates minimal `bots` and `order_records` tables if they don't already exist in the test DB; it truncates them during the test, so don't point TEST_DATABASE_URL at production.
