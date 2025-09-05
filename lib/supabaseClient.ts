/**
 * supabaseClient
 *
 * Browser / client-side Supabase wrapper.
 * - Uses NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
 * - Returns `null` when not configured so UI can gracefully fall back to mock data.
 *
 * Usage (client):
 * import { supabaseClient } from "@/lib/supabaseClient";
 * if (supabaseClient) { await supabaseClient.from('bots').select('*') }
 *
 * NOTE: Keep service role key server-only. Do NOT use SUPABASE_SERVICE_ROLE_KEY on the client.
 */

import { createClient } from "@supabase/supabase-js";

const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabaseClient = NEXT_PUBLIC_SUPABASE_URL && NEXT_PUBLIC_SUPABASE_ANON_KEY
  ? createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
  : null;

export function getSupabaseClient() {
  return supabaseClient;
}

export default supabaseClient;
