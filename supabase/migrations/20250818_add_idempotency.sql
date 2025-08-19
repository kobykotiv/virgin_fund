-- Migration: add idempotency_keys table (idempotent)
-- Run with psql or via supabase migrations tooling

BEGIN;

CREATE TABLE IF NOT EXISTS public.idempotency_keys (
  key text PRIMARY KEY,
  bot_id integer,
  status text DEFAULT 'pending',
  failure_count integer DEFAULT 0,
  meta jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ensure a unique index on key (key is primary so index exists), but keep an index for queries by bot_id
CREATE INDEX IF NOT EXISTS idx_idempotency_bot_id ON public.idempotency_keys (bot_id);

-- trigger to update updated_at on row changes
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_updated_at ON public.idempotency_keys;
CREATE TRIGGER trg_set_updated_at
  BEFORE UPDATE ON public.idempotency_keys
  FOR EACH ROW
  EXECUTE PROCEDURE public.set_updated_at();

COMMIT;
