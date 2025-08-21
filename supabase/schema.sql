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
