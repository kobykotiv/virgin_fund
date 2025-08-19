-- Migration: add_last_trade_at
-- Purpose: add last_trade_at to bots, backfill from order_records, and add index
-- Generated: 2025-08-18

-- Up
BEGIN;

-- Add the column to record the time of the most recent executed trade for a bot
ALTER TABLE bots
  ADD COLUMN IF NOT EXISTS last_trade_at timestamptz;

COMMENT ON COLUMN bots.last_trade_at IS
  'Timestamp of the bot''s most recent executed trade (used for sorting by activity and detecting stale bots)';

-- Backfill last_trade_at from order_records in a single set-based statement.
-- Uses COALESCE(executed_at, created_at) in case executed_at is NULL and created_at is available.
WITH last_exec AS (
  SELECT bot_id, max(coalesce(executed_at, created_at)) AS executed_at
  FROM order_records
  GROUP BY bot_id
)
UPDATE bots
SET last_trade_at = last_exec.executed_at
FROM last_exec
WHERE bots.id = last_exec.bot_id;

-- Index to support sorting and recent-activity queries.
CREATE INDEX IF NOT EXISTS idx_bots_last_trade_at ON bots (last_trade_at);

COMMIT;

-- Down
BEGIN;

DROP INDEX IF EXISTS idx_bots_last_trade_at;

ALTER TABLE bots
  DROP COLUMN IF EXISTS last_trade_at;

COMMIT;

-- Notes:
-- 1) The backfill is a single set-based UPDATE; it avoids per-row loops to scale to large tables.
-- 2) Ensure you run this migration against a test DB first. For very large tables consider doing the update in batches
--    or using a maintenance window to avoid long-running transactions.
