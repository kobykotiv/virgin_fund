-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Migration: add encrypted_keys table for storing server-side encrypted API credentials
CREATE TABLE IF NOT EXISTS encrypted_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  provider text NOT NULL,
  encrypted_value bytea NOT NULL,
  iv bytea NOT NULL,
  tag bytea NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  last_used timestamptz
);

-- FK to supabase auth users (adjust schema if your auth users table is different)
ALTER TABLE encrypted_keys
  ADD CONSTRAINT fk_encrypted_keys_user
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_encrypted_keys_user_id ON encrypted_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_encrypted_keys_provider ON encrypted_keys(provider);

-- Trigger to update updated_at on modifications
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_updated_at ON encrypted_keys;
CREATE TRIGGER trg_set_updated_at
BEFORE UPDATE ON encrypted_keys
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Summary of Changes:
-- 1) Created migration to add the `encrypted_keys` table to store server-side encrypted API credentials.
-- 2) Table includes fields for encrypted_value, iv, tag, metadata, timestamps, and active flag.
-- 3) Adds FK to `auth.users`, useful indexes, and an update trigger for `updated_at`.
-- 4) This migration is intended to be used with a server-side encryption library (AES-GCM) that will manage encrypt/decrypt operations outside the DB.
