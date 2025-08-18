-- Supabase schema for Virgin Fund trading bots

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
