-- Migration: create alpaca_keys table for storing Alpaca API keys (service role only)
-- Run this against your Supabase/Postgres database when enabling Supabase storage.

CREATE TABLE IF NOT EXISTS public.alpaca_keys (
  key_id TEXT PRIMARY KEY,
  secret TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Optionally create an index on updated_at for housekeeping queries
CREATE INDEX IF NOT EXISTS idx_alpaca_keys_updated_at ON public.alpaca_keys (updated_at);
