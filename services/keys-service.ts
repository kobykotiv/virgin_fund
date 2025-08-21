/**
 * services/keys-service.ts
 *
 * Server-side Supabase-backed service for API Key CRUD.
 * - Encrypts secrets with lib/crypto.encrypt before storing.
 * - Stores api_key_hash (sha256 base64) instead of raw public API keys.
 * - Does NOT perform authentication/session checks; callers (API routes) must call requireSession.
 *
 * Environment requirements:
 *  - SUPABASE_URL
 *  - SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY if you deliberately use an anon key)
 *  - KEY_ENCRYPTION_KEY (used by lib/crypto)
 *
 * Security notes:
 *  - This module never logs secrets.
 *  - revealKey returns the plaintext secret; the API route must ensure the caller is authorized and session is fresh.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { encrypt, decrypt } from "../lib/crypto";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables");
}

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

/**
 * Compute SHA-256 hash of apiKey and return base64 string.
 * Used so we never store raw API keys in DB.
 */
async function sha256Base64(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Buffer.from(digest).toString("base64");
}

export type CreateKeyParams = {
  name: string;
  provider?: string;
  apiKey?: string; // optional public key (we will hash it if provided)
  secret: string; // raw secret to be encrypted server-side
  isPaper?: boolean;
  metadata?: Record<string, unknown>;
};

/**
 * Create an API key record.
 * Returns the stored row metadata (without secret).
 */
export async function createKey(userId: string, params: CreateKeyParams) {
  const { name, provider = null, apiKey = null, secret, isPaper = false, metadata = {} } = params;

  if (!userId) throw new Error("userId is required");
  if (!name) throw new Error("name is required");
  if (!secret) throw new Error("secret is required");

  const api_key_hash = apiKey ? await sha256Base64(apiKey) : null;
  const encrypted_secret = await encrypt(secret);

  const payload: any = {
    user_id: userId,
    name,
    provider,
    api_key_hash,
    encrypted_secret,
    is_paper: isPaper,
    metadata,
  };

  const { data, error } = await supabase.from("api_keys").insert([payload]).select().single();

  if (error) {
    throw new Error(`Failed to insert api_key: ${error.message}`);
  }

  // Return safe metadata only (never include encrypted_secret or raw secret)
  const safe = {
    id: data.id,
    name: data.name,
    provider: data.provider,
    is_paper: data.is_paper,
    is_active: data.is_active,
    metadata: data.metadata,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };

  return safe;
}

/**
 * List API keys for a user (no secrets returned).
 */
export async function listKeys(userId: string) {
  if (!userId) throw new Error("userId is required");

  const { data, error } = await supabase
    .from("api_keys")
    .select("id, name, provider, is_paper, is_active, metadata, created_at, updated_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch api_keys: ${error.message}`);
  }

  return data as Array<{
    id: string;
    name: string;
    provider?: string | null;
    is_paper: boolean;
    is_active: boolean;
    metadata: Record<string, unknown>;
    created_at: string;
    updated_at: string;
  }>;
}

/**
 * Reveal (decrypt) an API secret for a key id.
 * Important: callers MUST enforce authorization and session freshness before calling this.
 * Returns: { id, name, provider, secret }
 */
export async function revealKey(userId: string, id: string) {
  if (!userId) throw new Error("userId is required");
  if (!id) throw new Error("id is required");

  const { data, error } = await supabase
    .from("api_keys")
    .select("id, name, provider, encrypted_secret, is_active")
    .eq("user_id", userId)
    .eq("id", id)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch api_key: ${error.message}`);
  }
  if (!data) {
    throw new Error("api_key not found");
  }
  if (!data.is_active) {
    throw new Error("api_key is not active");
  }
  if (!data.encrypted_secret) {
    throw new Error("no encrypted secret stored for this key");
  }

  const secret = await decrypt(data.encrypted_secret);

  return {
    id: data.id,
    name: data.name,
    provider: data.provider,
    secret,
  };
}

/**
 * Soft-delete (deactivate) an API key.
 */
export async function deleteKey(userId: string, id: string) {
  if (!userId) throw new Error("userId is required");
  if (!id) throw new Error("id is required");

  const { data, error } = await supabase
    .from("api_keys")
    .update({ is_active: false })
    .eq("user_id", userId)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to delete api_key: ${error.message}`);
  }

  return {
    id: data.id,
    is_active: data.is_active,
    updated_at: data.updated_at,
  };
}

/**
 * Update key metadata or rotate secret.
 * If `secret` is provided, it will be encrypted and stored.
 * Returns updated safe metadata.
 */
export async function updateKey(userId: string, id: string, updates: { metadata?: Record<string, unknown>; secret?: string; isActive?: boolean }) {
  if (!userId) throw new Error("userId is required");
  if (!id) throw new Error("id is required");

  const payload: any = {};
  if (updates.metadata) payload.metadata = updates.metadata;
  if (typeof updates.isActive === "boolean") payload.is_active = updates.isActive;
  if (updates.secret) {
    // encrypt new secret
    payload.encrypted_secret = await encrypt(updates.secret);
  }

  const { data, error } = await supabase
    .from("api_keys")
    .update(payload)
    .eq("user_id", userId)
    .eq("id", id)
    .select("id, name, provider, is_paper, is_active, metadata, created_at, updated_at")
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to update api_key: ${error.message}`);
  }
  if (!data) {
    throw new Error("api_key not found or not authorized");
  }

  return {
    id: data.id,
    name: data.name,
    provider: data.provider,
    is_paper: data.is_paper,
    is_active: data.is_active,
    metadata: data.metadata,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

export default {
  createKey,
  listKeys,
  revealKey,
  updateKey,
  deleteKey,
};

/*
Summary of Changes:
- Added services/keys-service.ts implementing createKey, listKeys, revealKey, deleteKey using Supabase and lib/crypto.encrypt/decrypt.
- Ensures api_key hashing (SHA-256 base64) and encrypted_secret storage (base64 iv||cipher||tag).
*/
