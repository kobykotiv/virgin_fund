/**
 * supabaseAdmin
 *
 * Server-side Supabase client wrapper.
 * - Uses SUPABASE_SERVICE_ROLE_KEY (must NOT be exposed to the browser)
 * - Falls back to `null` if service role key is not provided so code can safely
 *   continue using mock data during local development.
 *
 * Usage (server-only):
 * import { supabaseAdmin } from "@/lib/supabaseAdmin";
 * if (supabaseAdmin) { await supabaseAdmin.from('members').select('*'); }
 *
 * Ensure you set the following env vars for full integration:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 *
 * Do NOT expose SUPABASE_SERVICE_ROLE_KEY to the client.
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const supabaseAdmin = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

/**
 * Backwards-compatible accessor used by some existing API routes that import
 * `getSupabaseAdmin()`. Returns the same admin client or null when not configured.
 */
export function getSupabaseAdmin() {
  return supabaseAdmin;
}

export default supabaseAdmin;
