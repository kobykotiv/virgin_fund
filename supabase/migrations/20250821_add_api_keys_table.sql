-- Migration: add api_keys table for server-side encrypted API key storage
-- Date: 2025-08-21
-- Purpose: store encrypted secrets (base64 iv||ciphertext||tag), hash/fingerprint of public API key, metadata, and activation flags.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  provider text,
  -- store a hash/fingerprint of the public API key (sha256 base64) so we never store raw public keys for comparison
  api_key_hash text,
  -- encrypted_secret = base64(iv || ciphertext || tag) produced by server-side AES-256-GCM
  encrypted_secret text NOT NULL,
  is_paper boolean DEFAULT false,
  is_active boolean DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON public.api_keys (user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_created_at ON public.api_keys (created_at);

-- helper to update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_updated_at_api_keys ON public.api_keys;
CREATE TRIGGER trg_set_updated_at_api_keys
  BEFORE UPDATE ON public.api_keys
  FOR EACH ROW
  EXECUTE PROCEDURE public.set_updated_at();
