-- Migration: create signals table
-- Adjust SQL to your DB (Postgres example)

CREATE TABLE IF NOT EXISTS signals (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  ticker TEXT NOT NULL,
  condition TEXT NOT NULL,
  params JSONB,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add index on user_id for faster per-user queries
CREATE INDEX IF NOT EXISTS idx_signals_user_id ON signals (user_id);
