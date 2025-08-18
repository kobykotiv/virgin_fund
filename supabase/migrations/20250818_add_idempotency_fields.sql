-- Begin transaction for atomic migration
BEGIN;

-- Migration: add fields and constraints to idempotency_keys and create alerts table

-- Add columns if not exist
alter table if exists idempotency_keys
  add column if not exists bot_id bigint,
  add column if not exists status text default 'pending',
  add column if not exists alpaca_order_id text,
  add column if not exists error text,
  add column if not exists failure_count integer default 0,
  add column if not exists updated_at timestamptz default now();

-- Ensure 'key' is unique (already primary key in original schema). If primary key missing, create unique index.
-- Create unique index if it doesn't exist
create unique index if not exists uq_idempotency_key on idempotency_keys(key);

-- Create alerts table for monitoring repeated failures
create table if not exists alerts (
  id bigint primary key generated always as identity,
  source text not null,
  severity text not null,
  message text,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Commit transaction
COMMIT;
