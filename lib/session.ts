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
import { getSupabaseAdmin } from "./supabaseAdmin";

import { assertEnv } from "./env";
const env = assertEnv();

const SUPABASE_URL = env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;

// Default admin supabase client used when a client is not injected (production usage).
const defaultSupabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

function getDb(client?: SupabaseClient) {
  return client ?? defaultSupabase;
}

export const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "vf_session";
export const SESSION_MAX_AGE_SECONDS = Number(process.env.SESSION_MAX_AGE_SECONDS || 60 * 60 * 24 * 7); // 7 days by default

export type SessionRow = {
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

type CookieSpec = {
  name: string;
  value: string;
  opts?: {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "lax" | "strict" | "none" | string;
    path?: string;
    maxAge?: number;
    domain?: string;
    expires?: string;
  };
};

/**
 * Create a new session row and return cookie info.
 */
export async function createSession(
  userId: string,
  opts?: { maxAgeSeconds?: number; metadata?: Record<string, unknown> },
  client?: SupabaseClient
): Promise<{
  sessionToken: string;
  refreshToken: string;
  cookie: CookieSpec;
  row: SessionRow;
}> {
  if (!userId) throw new Error("userId is required");

  const db = getDb(client);

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

  const { data, error } = await db.from("sessions").insert([payload]).select().single();

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
export async function verifySessionToken(
  sessionToken: string,
  client?: SupabaseClient
): Promise<any> {
  if (!sessionToken) return null;

  const db = getDb(client);

  const { data, error } = await db
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
    await db.from("sessions").update({ last_used_at: new Date().toISOString() }).eq("id", data.id);
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
export async function refreshSession(
  refreshToken: string,
  client?: SupabaseClient
): Promise<{
  success: boolean;
  userId?: string;
  cookie?: CookieSpec;
  refreshToken?: string;
  error?: string;
}> {
  if (!refreshToken) return { success: false, error: "missing refresh token" };

  const db = getDb(client);

  // Lookup by refresh token
  const { data, error } = await db
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

  const { error: updateError } = await db.from("sessions").update(updates).eq("id", data.id);

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
 *
 * Behavior:
 *  - Marks the session row revoked in the local `sessions` table.
 *  - If `SESSION_REVOKE_SUPABASE === "true"` environment variable is set,
 *    attempts to revoke Supabase refresh tokens for the session's user id
 *    using the Supabase admin API (best-effort).
 */
export async function revokeSession(
  sessionTokenOrId: string,
  client?: SupabaseClient,
  adminGetter?: () => any
): Promise<{ success: boolean; error?: string }> {
  if (!sessionTokenOrId) return { success: false, error: "missing token" };

  const db = getDb(client);

  // Lookup session row by session_token or id to obtain user_id (if available)
  let sessionRow: any = null;
  try {
    const { data, error } = await db
      .from("sessions")
      .select("*")
      .or(`session_token.eq.${sessionTokenOrId},id.eq.${sessionTokenOrId}`)
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      sessionRow = data;
    }
  } catch (e) {
    // non-fatal, continue with best-effort revocation
    console.warn("revokeSession: lookup failed", e);
  }

  // Mark the session revoked (by id when known, otherwise try both token/id)
  try {
    if (sessionRow?.id) {
      await db.from("sessions").update({ revoked: true }).eq("id", sessionRow.id);
    } else {
      // best-effort: try by session_token then by id
      await db.from("sessions").update({ revoked: true }).eq("session_token", sessionTokenOrId);
      await db.from("sessions").update({ revoked: true }).eq("id", sessionTokenOrId);
    }
  } catch (e) {
    console.warn("revokeSession: failed to mark revoked", e);
  }

  // Optionally revoke Supabase auth refresh tokens for the user (best-effort)
  if (process.env.SESSION_REVOKE_SUPABASE === "true" && sessionRow?.user_id) {
    try {
      // Use injected adminGetter when provided (test-friendly), otherwise fallback to runtime getter.
      const admin = adminGetter ? adminGetter() : getSupabaseAdmin();
      // supabase-js exposes admin methods under auth.admin for recent versions
      if ((admin as any).auth?.admin?.revokeRefreshTokensForUser) {
        await (admin as any).auth.admin.revokeRefreshTokensForUser(sessionRow.user_id);
      } else if ((admin as any).auth?.revokeRefreshTokensForUser) {
        // fallback older naming
        await (admin as any).auth.revokeRefreshTokensForUser(sessionRow.user_id);
      } else {
        console.warn("revokeSession: supabase admin revoke API not available on client");
      }
    } catch (e) {
      console.warn("revokeSession: failed to revoke supabase auth tokens (best-effort)", e);
    }
  }

  return { success: true };
}

/**
 * requireRecentSession - helper to enforce session recency (e.g., for reveal endpoints).
 * Throws Error when session is not fresh.
 */
export function requireRecentSession(
  sessionRow: SessionRow | { last_used_at?: string; issued_at?: string } | null,
  maxAgeMs = 15 * 60 * 1000
): boolean {
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
