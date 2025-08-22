import { supabaseAdmin } from "../lib/supabaseAdmin";
import * as cryptoLib from "../lib/crypto";

/**
 * services/keys-service.ts
 *
 * Server-side API keys service. Stores encrypted secrets in `api_keys` table.
 *
 * Functions:
 *  - createKey(userId, params)
 *  - listKeys(userId)
 *  - revealKey(userId, id)
 *  - updateKey(userId, id, updates)
 *  - deleteKey(userId, id)
 *
 * Notes:
 *  - encrypted_secret is stored as base64(iv||ciphertext||tag) via lib/crypto.encrypt
 *  - api_key_hash is SHA-256(base64) of provided apiKey (if any) to allow lookup without storing raw key
 *  - All operations validate ownership by user_id
 */

type CreateKeyParams = {
  name: string;
  provider: string;
  apiKey?: string | null; // public-ish key to hash
  secret: string; // raw secret to be encrypted
  isPaper?: boolean;
  metadata?: Record<string, unknown>;
};

type UpdateKeyParams = {
  metadata?: Record<string, unknown> | null;
  secret?: string | null;
  isActive?: boolean | null;
};

function bufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  // btoa expects binary string
  return typeof btoa !== "undefined" ? btoa(binary) : Buffer.from(bytes).toString("base64");
}

async function sha256Base64(input: string): Promise<string> {
  if (typeof crypto !== "undefined" && (crypto as any).subtle?.digest) {
    const data = new TextEncoder().encode(input);
    const hash = await (crypto as any).subtle.digest("SHA-256", data);
    return bufferToBase64(hash);
  }
  // Fallback to Node/Bun crypto
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodeCrypto = require("crypto");
    return nodeCrypto.createHash("sha256").update(input).digest("base64");
  } catch (e) {
    throw new Error("No crypto available for hashing");
  }
}

export async function createKey(userId: string, params: CreateKeyParams) {
  if (!userId) throw new Error("userId required");
  if (!params?.name || !params?.provider) throw new Error("name and provider are required");
  if (!params.secret) throw new Error("secret is required");

  const apiKeyHash = params.apiKey ? await sha256Base64(params.apiKey) : null;
  const encrypted = await cryptoLib.encrypt(params.secret);

  const payload: any = {
    user_id: userId,
    name: params.name,
    provider: params.provider,
    api_key_hash: apiKeyHash,
    encrypted_secret: encrypted,
    is_paper: params.isPaper ?? false,
    is_active: true,
    metadata: params.metadata ?? {},
  };

  const { data, error } = await supabaseAdmin.from("api_keys").insert([payload]).select().limit(1).single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to create api key");
  }

  // Return masked representation (no secret)
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

export async function listKeys(userId: string) {
  if (!userId) throw new Error("userId required");
  const { data, error } = await supabaseAdmin
    .from("api_keys")
    .select("id,name,provider,is_paper,is_active,metadata,created_at,updated_at,api_key_hash")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  // Map to masked view (do not include encrypted_secret)
  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    provider: row.provider,
    is_paper: row.is_paper,
    is_active: row.is_active,
    metadata: row.metadata,
    created_at: row.created_at,
    updated_at: row.updated_at,
    api_key_hash: row.api_key_hash ?? null,
  }));
}

export async function revealKey(userId: string, id: string) {
  if (!userId) throw new Error("userId required");
  if (!id) throw new Error("id required");

  const { data, error } = await supabaseAdmin
    .from("api_keys")
    .select("*")
    .eq("id", id)
    .limit(1)
    .single();

  if (error || !data) {
    throw new Error("Not found");
  }

  if (data.user_id !== userId) {
    throw new Error("Unauthorized");
  }

  if (!data.is_active) {
    throw new Error("Key is inactive");
  }

  const decrypted = await cryptoLib.decrypt(data.encrypted_secret);
  return {
    id: data.id,
    name: data.name,
    provider: data.provider,
    secret: decrypted,
    is_paper: data.is_paper,
    metadata: data.metadata,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

export async function updateKey(userId: string, id: string, updates: UpdateKeyParams) {
  if (!userId) throw new Error("userId required");
  if (!id) throw new Error("id required");
  const { data: existing, error: fetchErr } = await supabaseAdmin
    .from("api_keys")
    .select("*")
    .eq("id", id)
    .limit(1)
    .maybeSingle();

  if (fetchErr || !existing) throw new Error("Not found");
  if (existing.user_id !== userId) throw new Error("Unauthorized");

  const changes: any = {};
  if (typeof updates.metadata !== "undefined" && updates.metadata !== null) changes.metadata = updates.metadata;
  if (typeof updates.isActive !== "undefined" && updates.isActive !== null) changes.is_active = updates.isActive;
  if (typeof updates.secret !== "undefined" && updates.secret !== null) {
    // rotate secret: re-encrypt
    changes.encrypted_secret = await cryptoLib.encrypt(updates.secret);
  }

  if (Object.keys(changes).length === 0) {
    throw new Error("No changes provided");
  }

  const { data: updated, error: updateErr } = await supabaseAdmin
    .from("api_keys")
    .update(changes)
    .eq("id", id)
    .select()
    .limit(1)
    .maybeSingle();

  if (updateErr) throw new Error(updateErr.message || "Failed to update key");

  return {
    id: updated.id,
    name: updated.name,
    provider: updated.provider,
    is_paper: updated.is_paper,
    is_active: updated.is_active,
    metadata: updated.metadata,
    created_at: updated.created_at,
    updated_at: updated.updated_at,
  };
}

export async function deleteKey(userId: string, id: string) {
  if (!userId) throw new Error("userId required");
  if (!id) throw new Error("id required");

  const { data: existing, error: fetchErr } = await supabaseAdmin
    .from("api_keys")
    .select("*")
    .eq("id", id)
    .limit(1)
    .maybeSingle();

  if (fetchErr || !existing) throw new Error("Not found");
  if (existing.user_id !== userId) throw new Error("Unauthorized");

  const { data, error } = await supabaseAdmin.from("api_keys").update({ is_active: false }).eq("id", id).select().limit(1).maybeSingle();

  if (error) throw new Error(error.message || "Failed to delete key");

  return { id: data.id, is_active: data.is_active };
}

export default {
  createKey,
  listKeys,
  revealKey,
  updateKey,
  deleteKey,
};
