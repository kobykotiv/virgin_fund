/**
 * middleware/sessionMiddleware.ts
 *
 * Consolidated session middleware that delegates core session operations to
 * `lib/session.ts`. This file adapts sessionLib outputs for API route and
 * middleware use (requireSession, requireSessionOrRedirect) and provides
 * helper utilities for setting/clearing httpOnly session cookies on responses.
 *
 * Behavior:
 *  - try Authorization header (getUserFromAuthHeader) first
 *  - fallback to cookie-based session verification via sessionLib.verifySessionToken
 *  - if cookie session expired, attempt rotation via sessionLib.refreshSession
 */
import { NextRequest, NextResponse } from "next/server";
import { getUserFromAuthHeader } from "@/lib/auth";
import * as sessionLib from "../lib/session";


import { createClient } from "@supabase/supabase-js"; // only if needed elsewhere

/* NOTE: Legacy direct Supabase access has been removed from this module.
   Use lib/session.ts for DB operations. */

/**
 * requireSession - Ensure request is authenticated via Authorization header.
 * Returns { userId } on success or throws a Response with 401.
 */
export async function requireSession(req: NextRequest) {
  // 1) Try Authorization header first (API clients / Bearer tokens)
  const user = await getUserFromAuthHeader(req);
  if (user?.id) return { userId: user.id, user };

  // 2) Attempt cookie-based session verification (httpOnly cookie)
  const cookie = req.cookies?.get?.("vf_session")?.value || null;
  if (!cookie) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const verified = await sessionLib.verifySessionToken(cookie);

  // If invalid
  if (!verified) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  // If expired, attempt refresh using refresh token via sessionLib
  if ((verified as any).expired && (verified as any).session?.refresh_token) {
    const refreshToken = (verified as any).session.refresh_token;
    const result = await sessionLib.refreshSession(refreshToken);
    if (result?.success) {
      // Caller should set cookie on response using returned cookie info.
      return { userId: result.userId, user: { id: result.userId }, rotatedCookie: result.cookie, newRefreshToken: result.refreshToken };
    }
    throw new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  // Valid, not expired
  const sessionRow = (verified as any).session ? (verified as any).session : verified;
  return { userId: sessionRow.user_id, user: { id: sessionRow.user_id }, session: sessionRow };
}

/**
 * requireSessionOrRedirect - Helper for middleware contexts.
 * If session not found, returns a NextResponse redirect to /login.
 */
export async function requireSessionOrRedirect(req: NextRequest) {
  const user = await getUserFromAuthHeader(req);
  if (user?.id) return null;

  // Try cookie-based session as a last resort
  const cookie = req.cookies?.get?.("vf_session")?.value || null;
  if (cookie) {
    const verified = await sessionLib.verifySessionToken(cookie);
    if (verified && !(verified as any).expired) return null;
  }

  const loginUrl = new URL("/login", req.url);
  return NextResponse.redirect(loginUrl);
}

/**
 * verifySessionCookie - Verify a session token stored in httpOnly cookie.
 * Stub implementation; replace with real lookup against session store.
 */
export async function verifySessionCookie(req: NextRequest) {
  const cookie = req.cookies?.get?.("vf_session")?.value || null;
  if (!cookie) return null;
  const verified = await sessionLib.verifySessionToken(cookie);
  return verified;
}

/**
 * refreshSessionTokens - Attempt to refresh a session using the refresh token.
 * Stub: implement rotation, revocation, and secure cookie replacement.
 */
export async function refreshSessionTokens(refreshToken: string) {
  return sessionLib.refreshSession(refreshToken);
}

/**
 * setSessionCookieOnResponse - Helper to attach secure cookies to NextResponse.
 * Use on server-side routes / middleware to set cookies with proper flags.
 */
export function setSessionCookieOnResponse(res: NextResponse, name: string, value: string, opts?: { maxAge?: number }) {
  const maxAge = opts?.maxAge ?? Number(process.env.SESSION_MAX_AGE_SECONDS ?? 60 * 60 * 24 * 7);
  try {
    res.cookies.set({
      name,
      value,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      path: "/",
      maxAge,
    });
  } catch {
    const cookieStr = `${name}=${value}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Strict${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
    res.headers.set("Set-Cookie", cookieStr);
  }
}

/**
 * revokeSession - Remove session row and clear cookie.
 */
export async function revokeSession(sessionToken: string) {
  return sessionLib.revokeSession(sessionToken);
}

// Summary of this file:
// - Contains requireSession and requireSessionOrRedirect helpers for API & middleware.
// - Includes stubbed cookie-based session verification and refresh helpers.
// - TODOs indicate where to wire Supabase session table or other server-side store.
//
// Security notes:
// - Use httpOnly, secure cookies for session tokens.
// - Store refresh tokens server-side (DB or secure store) and rotate them on use.
// - Revoke on logout or suspicious activity.
