-- Migration: order_records_indexes
-- Purpose: add partial/compound index to accelerate queries fetching recent filled orders per bot
-- Generated: 2025-08-19

-- Up
BEGIN;

-- Partial index for filled orders with non-null executed_at. Speeds queries like:
--   SELECT * FROM order_records WHERE bot_id = $1 AND status = 'filled' ORDER BY executed_at DESC LIMIT 1;
CREATE INDEX IF NOT EXISTS idx_order_records_bot_filled_executed_at
  ON order_records (bot_id, executed_at DESC)
  WHERE status = 'filled' AND executed_at IS NOT NULL;

COMMIT;

-- Down
BEGIN;

DROP INDEX IF EXISTS idx_order_records_bot_filled_executed_at;

COMMIT;

-- Validation guidance (run on the DB):
-- 1) Before applying Up, run EXPLAIN ANALYZE on the target query and note whether a Seq Scan is used.
--    EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM order_records WHERE bot_id = 123 AND status='filled' ORDER BY executed_at DESC LIMIT 1;
-- 2) Apply Up and run the same EXPLAIN again — plan should prefer an Index Scan/Index Only Scan.
-- 3) If the dataset is enormous, consider partitioning order_records by created_at (monthly) and creating the same partial index per partition.
