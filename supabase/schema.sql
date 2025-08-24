-- Supabase schema for Virgin Fund trading bots
-- High Stakes Trading App: Initial Tables

CREATE TABLE IF NOT EXISTS high_stakes_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  status text NOT NULL DEFAULT 'active', -- active, closed, liquidated, etc.
  leverage numeric(5,2) NOT NULL DEFAULT 1.00,
  max_drawdown numeric(10,4),
  risk_limit numeric(12,4),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS risk_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES high_stakes_sessions(id) NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  event_type text NOT NULL, -- e.g., 'margin_call', 'limit_breach', 'manual_review'
  event_details jsonb,
  triggered_at timestamptz NOT NULL DEFAULT now(),
  resolved boolean NOT NULL DEFAULT false,
  resolved_at timestamptz
);

-- Summary of Changes:
-- - Added high_stakes_sessions table for tracking user high-stakes trading sessions, leverage, and risk.
-- - Added risk_events table for logging risk-related events and auditability.

-- Bots table
create table if not exists bots (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users not null,
  name text not null,
  currency text check (currency in ('USD','EUR','BTC','ETH')) not null,
  dca_amount numeric not null default 0,
  dca_frequency text default 'manual',
  stop_loss numeric not null default -5,
  stop_loss_mode text check (stop_loss_mode in ('none','fixed','trailing')) default 'fixed',
  trailing_distance_pct numeric default 0,
  exchange_account text check (exchange_account in ('paper','live')) default 'paper',
  enabled boolean default true,
  liquidated boolean default false,
  backtest_stats jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_bots_user_id on bots(user_id);

-- Backtests table
create table if not exists backtests (
  id bigint primary key generated always as identity,
  bot_id bigint references bots(id) on delete cascade,
  params jsonb not null,
  results jsonb not null,
  summary jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_backtests_bot_id on backtests(bot_id);

-- Settings table (per-user)
create table if not exists settings (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users not null,
  global_stoploss_enabled boolean default false,
  hide_liquidation_button boolean default true,
  developer_mode boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index if not exists uq_settings_user on settings(user_id);

-- Liquidation log
create table if not exists liquidations (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users not null,
  reason text,
  metadata jsonb,
  executed_at timestamptz default now()
);

create index if not exists idx_liquidations_user_id on liquidations(user_id);

-- Order records / trade audit
create table if not exists order_records (
  id bigint primary key generated always as identity,
  bot_id bigint references bots(id) on delete cascade,
  alpaca_order_id text,
  type text,
  side text,
  qty numeric,
  filled_qty numeric,
  price numeric,
  status text,
  meta jsonb,
  created_at timestamptz default now(),
  executed_at timestamptz
);

create index if not exists idx_order_records_bot_id on order_records(bot_id);

-- Webhook logs
create table if not exists webhook_logs (
  id bigint primary key generated always as identity,
  source text,
  payload jsonb,
  headers jsonb,
  created_at timestamptz default now()
);

-- Idempotency keys table to prevent duplicate execute requests
create table if not exists idempotency_keys (
  key text primary key,
  user_id uuid references auth.users,
  response jsonb,
  created_at timestamptz default now()

);

-- Watchlists: user-curated lists of tickers/assets for quick monitoring
CREATE TABLE IF NOT EXISTS public.watchlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb, -- array of ticker symbols or asset identifiers
  is_public boolean DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_watchlists_user_id ON public.watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlists_created_at ON public.watchlists(created_at);

-- Alerts: user-defined alerts attached to watchlists or standalone
CREATE TABLE IF NOT EXISTS public.alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  watchlist_id uuid REFERENCES public.watchlists(id), -- optional
  name text,
  condition jsonb NOT NULL, -- e.g. { "symbol": "AAPL", "op": "<=", "price": 150 }
  method text NOT NULL DEFAULT 'in_app', -- in_app, email, webhook
  payload jsonb DEFAULT '{}'::jsonb, -- method-specific payload (webhook url, email template)
  is_active boolean DEFAULT true,
  last_triggered_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON public.alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_watchlist_id ON public.alerts(watchlist_id);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON public.alerts(created_at);

-- set_updated_at helper and triggers
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_updated_at_watchlists ON public.watchlists;
CREATE TRIGGER trg_set_updated_at_watchlists
  BEFORE UPDATE ON public.watchlists
  FOR EACH ROW
  EXECUTE PROCEDURE public.set_updated_at();

DROP TRIGGER IF EXISTS trg_set_updated_at_alerts ON public.alerts;
CREATE TRIGGER trg_set_updated_at_alerts
  BEFORE UPDATE ON public.alerts
  FOR EACH ROW
  EXECUTE PROCEDURE public.set_updated_at();

-- Notifications: records generated when alerts trigger or system events occur
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id uuid REFERENCES public.alerts(id),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  payload jsonb DEFAULT '{}'::jsonb,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_alert_id ON public.notifications(alert_id);

-- Strategies table: store generic strategies (dca, grid, indicator, etc.)
CREATE TABLE IF NOT EXISTS public.strategies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('dca','grid','indicator','basket')),
  is_public boolean DEFAULT false,
  config jsonb NOT NULL DEFAULT '{}'::jsonb, -- strategy-specific configuration
  status text NOT NULL DEFAULT 'active', -- active, paused, stopped
  last_run timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_strategies_user_id ON public.strategies(user_id);
CREATE INDEX IF NOT EXISTS idx_strategies_type ON public.strategies(type);

DROP TRIGGER IF EXISTS trg_set_updated_at_strategies ON public.strategies;
CREATE TRIGGER trg_set_updated_at_strategies
  BEFORE UPDATE ON public.strategies
  FOR EACH ROW
  EXECUTE PROCEDURE public.set_updated_at();
