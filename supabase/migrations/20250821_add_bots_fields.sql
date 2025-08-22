-- Migration: add fields to bots to match dashboard UI
-- Run this in Supabase SQL editor or via your migration tooling

BEGIN;

ALTER TABLE IF EXISTS bots
  ADD COLUMN IF NOT EXISTS strategy text,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'Stopped',
  ADD COLUMN IF NOT EXISTS pnl numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS capital numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_trade timestamptz,
  ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- Ensure updated_at has sensible default
ALTER TABLE IF EXISTS bots
  ALTER COLUMN updated_at SET DEFAULT now();

-- Optional index for status and user filtering
CREATE INDEX IF NOT EXISTS idx_bots_user_status ON bots (user_id, status);

COMMIT;
