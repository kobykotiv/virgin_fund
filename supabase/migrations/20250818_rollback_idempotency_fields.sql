-- Rollback migration for 20250818_add_idempotency_fields.sql
BEGIN;

-- Remove columns added
alter table if exists idempotency_keys
  drop column if exists failure_count,
  drop column if exists error,
  drop column if exists alpaca_order_id,
  drop column if exists status,
  drop column if exists bot_id,
  drop column if exists updated_at;

-- Drop unique index if exists
drop index if exists uq_idempotency_key;

-- Drop alerts table
drop table if exists alerts;

COMMIT;
