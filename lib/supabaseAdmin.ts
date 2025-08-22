import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase admin client.
 * This module MUST only be imported from server/runtime code (API routes, server components).
 * It validates required env vars at import time and never logs secrets.
 */

import { assertEnv } from "./env";

const env = assertEnv();
const SUPABASE_URL = env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

export function getSupabaseAdmin(): SupabaseClient {
  return supabaseAdmin;
}
