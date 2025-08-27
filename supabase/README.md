Supabase schema notes

This folder contains SQL migrations and notes for the supabase schema expected by the project.

Tables added/used by the application:

- backtests: stores backtest runs with parameters and results (jsonb)
- watchlists: user-created watchlists (assets stored as jsonb array)
- alert_rules: configured alert rules tied to watchlists
- strategies: saved strategy templates
- alert_events: persisted alert triggers (used to emit realtime events)
- api_keys: provider API keys for Alpaca and others

To apply migrations locally (psql):

psql "$SUPABASE_DB_URL" -f supabase/migrations/2025-08-26-add-backtests-watchlists-alerts.sql

If you use the Supabase CLI, you can create a new migration and apply it using the CLI instead.
