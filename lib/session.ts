/**
 * lib/session.ts
 *
 * Session helpers using Supabase `sessions` table and secure httpOnly cookies.
 *
 * Exports:
 *  - createSession(userId, opts) -> { sessionToken, refreshToken, cookie }
 *  - verifySessionToken(sessionToken) -> session row | null
 *  - refreshSession(refreshToken) -> { success, cookie, userId, error }
 *  - revokeSession(sessionToken) -> { success, error }
 *  - requireRecentSession(sessionToken, maxAgeMs) -> throws if not recent
 *
 * Notes:
 *  - Expects environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *  - Cookie flags: httpOnly, SameSite=Strict, Secure in production
 *  - Session rotation: refreshSession rotates both session_token and refresh_token
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables");
}

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "vf_session";
const SESSION_MAX_AGE_SECONDS = Number(process.env.SESSION_MAX_AGE_SECONDS || 60 * 60 * 24 * 7); // 7 days by default

type SessionRow = {
  id: string;
  user_id: string;
  session_token: string;
  refresh_token: string;
  expires_at: string; // ISO string
  issued_at?: string;
  last_used_at?: string;
  revoked?: boolean;
  metadata?: Record<string, unknown>;
};

/**
 * Create a new session row and return cookie info.
 */
export async function createSession(userId: string, opts?: { maxAgeSeconds?: number; metadata?: Record<string, unknown> }) {
  if (!userId) throw new Error("userId is required");

  const sessionToken = crypto.randomUUID();
  const refreshToken = crypto.randomUUID();
  const issuedAt = new Date().toISOString();
  const maxAge = opts?.maxAgeSeconds ?? SESSION_MAX_AGE_SECONDS;
  const expiresAt = new Date(Date.now() + maxAge * 1000).toISOString();

  const payload: any = {
    user_id: userId,
    session_token: sessionToken,
    refresh_token: refreshToken,
    issued_at: issuedAt,
    last_used_at: issuedAt,
    expires_at: expiresAt,
    revoked: false,
    metadata: opts?.metadata ?? {},
  };

  const { data, error } = await supabase.from("sessions").insert([payload]).select().single();

  if (error) {
    throw new Error(`Failed to create session: ${error.message}`);
  }

  const cookie = {
    name: COOKIE_NAME,
    value: sessionToken,
    opts: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      path: "/",
      maxAge,
    },
  };

  return {
    sessionToken,
    refreshToken,
    cookie,
    row: data as SessionRow,
  };
}

/**
 * Query session row by session token and validate expiry/revocation.
 */
export async function verifySessionToken(sessionToken: string) {
  if (!sessionToken) return null;

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("session_token", sessionToken)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("verifySessionToken supabase error", error);
    return null;
  }
  if (!data) return null;
  if (data.revoked) return null;

  const now = new Date();
  const expiresAt = new Date(data.expires_at);
  if (expiresAt < now) return { expired: true, session: data };

  // update last_used_at
  try {
    await supabase.from("sessions").update({ last_used_at: new Date().toISOString() }).eq("id", data.id);
  } catch (e) {
    // non-fatal
    console.warn("failed to update last_used_at", e);
  }

  return data as SessionRow;
}

/**
 * Refresh a session using a refresh token (rotates both tokens).
 * Implements single-use refresh token semantics (rotate on use).
 */
export async function refreshSession(refreshToken: string) {
  if (!refreshToken) return { success: false, error: "missing refresh token" };

  // Lookup by refresh token
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("refresh_token", refreshToken)
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return { success: false, error: "invalid refresh token" };
  }
  if (data.revoked) return { success: false, error: "revoked" };

  // rotate tokens
  const newSessionToken = crypto.randomUUID();
  const newRefreshToken = crypto.randomUUID();
  const now = new Date();
  const maxAge = SESSION_MAX_AGE_SECONDS;
  const expiresAt = new Date(now.getTime() + maxAge * 1000).toISOString();

  const updates: any = {
    session_token: newSessionToken,
    refresh_token: newRefreshToken,
    expires_at: expiresAt,
    last_used_at: now.toISOString(),
    // optionally track rotation count, last_rotated_at
    last_rotated_at: now.toISOString(),
  };

  const { error: updateError } = await supabase.from("sessions").update(updates).eq("id", data.id);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  const cookie = {
    name: COOKIE_NAME,
    value: newSessionToken,
    opts: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      path: "/",
      maxAge,
    },
  };

  return {
    success: true,
    userId: data.user_id,
    cookie,
    refreshToken: newRefreshToken,
  };
}

/**
 * Revoke a session by session token (or id).
 */
export async function revokeSession(sessionTokenOrId: string) {
  if (!sessionTokenOrId) return { success: false, error: "missing token" };

  // Attempt by session_token first, then id
  let q = supabase.from("sessions").update({ revoked: true }).eq("session_token", sessionTokenOrId);
  const { error } = await q;

  // If update didn't match, try by id
  // (supabase JS returns error only on failure; we don't get row count easily here, so perform a secondary attempt)
  try {
    await supabase.from("sessions").update({ revoked: true }).eq("id", sessionTokenOrId);
  } catch (e) {
    // ignore
  }

  return { success: true };
}

/**
 * requireRecentSession - helper to enforce session recency (e.g., for reveal endpoints).
 * Throws Error when session is not fresh.
 */
export function requireRecentSession(sessionRow: SessionRow | { last_used_at?: string; issued_at?: string } | null, maxAgeMs = 15 * 60 * 1000) {
  if (!sessionRow) throw new Error("No session");
  const last = sessionRow.last_used_at ?? sessionRow.issued_at;
  if (!last) throw new Error("Session missing timestamps");
  const lastMs = new Date(last).getTime();
  if (Date.now() - lastMs > maxAgeMs) {
    throw new Error("Session too old; re-auth required");
  }
  return true;
}

export default {
  createSession,
  verifySessionToken,
  refreshSession,
  revokeSession,
  requireRecentSession,
};
