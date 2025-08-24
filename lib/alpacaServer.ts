/**
 * lib/alpacaServer.ts
 *
 * Small helper functions for server-side Alpaca integration:
 *  - getAlpacaCredentialsForUser(userId)
 *  - getUserFromRequest(req)
 *
 * This file expects a Supabase admin client in `lib/supabaseAdmin.ts`
 * and session helpers in `lib/session.ts` (verifySessionToken).
 *
 * Keep implementations minimal: they return raw credential fields used
 * by the server proxy routes under `app/api/alpaca/...`.
 */

import { getSupabaseAdmin } from "./supabaseAdmin";
import { verifySessionToken } from "./session";

export type AlpacaCreds = {
  id: string;
  key: string;
  secret: string;
  meta: Record<string, any>;
  is_active?: boolean;
  is_paper?: boolean;
};

/**
 * Fetch Alpaca API key/secret for a given user from the `api_keys` table.
 * Returns null when no credentials are found or on error.
 */
export async function getAlpacaCredentialsForUser(userId: string): Promise<AlpacaCreds | null> {
  if (!userId) return null;
  const supabase = getSupabaseAdmin();

  try {
    const { data, error } = await supabase
      .from("api_keys")
      .select("id, provider, key, secret, meta, is_active, is_paper")
      .eq("user_id", userId)
      .eq("provider", "alpaca")
      .single();

    if (error || !data) {
      // Do not throw here - routes will map null -> 404
      console.warn("getAlpacaCredentialsForUser: no creds or error", error);
      return null;
    }

    return {
      id: data.id,
      key: data.key,
      secret: data.secret,
      meta: data.meta || {},
      is_active: data.is_active ?? true,
      is_paper: data.is_paper ?? false,
    };
  } catch (e) {
    console.warn("getAlpacaCredentialsForUser: unexpected error", e);
    return null;
  }
}

/**
 * Extracts session token from request cookies and verifies it using lib/session.verifySessionToken.
 * - Supports Next.js App Router Request objects (which expose headers).
 * - Expects cookie name `vf_session` by default (matches lib/session COOKIE_NAME).
 *
 * Returns the userId string, or null if not authenticated.
 */
export async function getUserFromRequest(req: Request): Promise<string | null> {
  try {
    // Next.js app-route Request doesn't expose cookies directly; read headers.cookie
    // Fallback to empty string when no header present.
    const cookieHeader = (req as any).headers?.get?.("cookie") ?? "";
    const match = /vf_session=([^;]+)/.exec(cookieHeader);
    const token = match?.[1];
    if (!token) return null;

    const session = await verifySessionToken(token);
    // verifySessionToken returns the session row or null/expired object
    if (!session) return null;
    // session.user_id is the column used across this codebase
    return (session as any).user_id ?? (session as any).userId ?? null;
  } catch (e) {
    console.warn("getUserFromRequest failed", e);
    return null;
  }
}

export default {
  getAlpacaCredentialsForUser,
  getUserFromRequest,
};
