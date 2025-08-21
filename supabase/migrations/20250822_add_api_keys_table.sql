-- Migration: add api_keys table for server-side encrypted API credentials
-- Date: 2025-08-22

-- Ensure pgcrypto is available for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.api_keys (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  provider text NOT NULL,
  api_key_hash text NULL,            -- SHA-256 hash (base64) of public API key for lookup/comparison (no raw key)
  encrypted_secret text NOT NULL,    -- base64(iv||ciphertext||tag) AES-256-GCM blob
  is_paper boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_created_at ON public.api_keys(created_at);

-- Trigger to update updated_at on row update
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_updated_at ON public.api_keys;
CREATE TRIGGER trg_set_updated_at
BEFORE UPDATE ON public.api_keys
FOR EACH ROW
EXECUTE PROCEDURE public.set_updated_at();

-- Summary:
-- - Stores encrypted_secret as a single base64 blob containing iv||ciphertext||tag (AES-256-GCM).
-- - api_key_hash allows searching/matching without storing raw key material.
-- - Use KEY_ENCRYPTION_KEY (base64 32 bytes) in server to encrypt/decrypt secrets.
