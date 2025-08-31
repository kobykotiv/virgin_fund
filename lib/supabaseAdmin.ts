import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { readAlpacaKeys, writeAlpacaKeys } from "./server-keys"

let supabase: SupabaseClient | null = null

if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  try {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  } catch (e) {
    supabase = null
  }
}

export async function getAlpacaKeysFromStore(): Promise<{ keyId?: string | null; secretExists: boolean } | null> {
  // If Supabase configured, read from table `alpaca_keys` (single row)
  if (supabase) {
    try {
      const { data, error } = await supabase.from("alpaca_keys").select("key_id").limit(1).maybeSingle()
      if (error) throw error
      if (!data) return { keyId: null, secretExists: false }
      return { keyId: data.key_id || null, secretExists: true }
    } catch (e) {
      // fallback to file
      return readAlpacaKeys() ? { keyId: readAlpacaKeys()!.keyId || null, secretExists: true } : null
    }
  }

  const keys = readAlpacaKeys()
  if (!keys) return null
  return { keyId: keys.keyId || null, secretExists: !!keys.secret }
}

export async function setAlpacaKeysInStore(keyId: string, secret: string) {
  if (supabase) {
    // upsert into alpaca_keys using a fixed primary key or single-row table
    try {
      const payload = { key_id: keyId, secret, updated_at: new Date().toISOString() }
      const { error } = await supabase.from("alpaca_keys").upsert(payload, { onConflict: ["key_id"] })
      if (error) throw error
      return true
    } catch (e) {
      // fallback
      writeAlpacaKeys(keyId, secret)
      return true
    }
  }

  writeAlpacaKeys(keyId, secret)
  return true
}

export function hasSupabase() {
  return !!supabase
}
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const getSupabaseAdmin = () => {
  if (!supabaseUrl || !supabaseServiceKey) {
    // Provide a mock client in test environments to avoid throwing at import time
    return {
      from: () => ({ select: async () => ({ data: [], error: null }), update: async () => ({ data: [], error: null }) }),
      auth: { admin: { revokeUserSessions: async () => ({ data: null, error: null }) } },
    }
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
