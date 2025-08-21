// middleware/sessionMiddleware.ts
// Server-side session verification & helpers for protected routes.
//
// This file provides lightweight utilities suitable for Bun + Next.js app-router
// API routes. It uses the existing `getUserFromAuthHeader` helper (which reads
// the Authorization header) as the primary authentication method, and includes
// helper stubs for cookie-based session verification / refresh that you can
// wire to Supabase or another server-side session store.
//
// Usage examples:
//  - In an API route: const { userId } = await requireSession(req)
//  - In middleware: const res = await requireSessionOrRedirect(req)
//  - For refresh flows: call refreshSessionTokens(refreshToken)
//
// NOTES / TODOs:
//  - Wire `verifySessionCookie` to your session store (Supabase table or Redis).
//  - Use secure, httpOnly, SameSite=strict cookies for session tokens.
//  - Implement refresh token rotation and revoke on logout/compromise.
//  - Ensure `ENCRYPTION_KEY` and `COOKIE_SECRET` are set in env variables.

import { NextRequest, NextResponse } from "next/server";
import { getUserFromAuthHeader } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server-side secret
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * requireSession - Ensure request is authenticated via Authorization header.
 * Returns { userId } on success or throws a Response with 401.
 */
export async function requireSession(req: NextRequest) {
  // 1) Try Authorization header first (API clients / Bearer tokens)
  const user = await getUserFromAuthHeader(req);
  if (user?.id) return { userId: user.id, user };

  // 2) Attempt cookie-based session verification (httpOnly cookie)
  const cookieResult = await verifySessionCookie(req);

  // If no cookie result, unauthorized
  if (!cookieResult) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  // If cookie is valid and not expired, return user
  if ((cookieResult as any).userId) {
    return { userId: (cookieResult as any).userId, user: { id: (cookieResult as any).userId } };
  }

  // If session is expired, try to refresh using stored refresh token
  if ((cookieResult as any).expired && (cookieResult as any).session?.refresh_token) {
    const refreshToken = (cookieResult as any).session.refresh_token;
    const result = await refreshSessionTokens(refreshToken);
    if (result?.success) {
      // Return the refreshed user id (caller may set cookie using returned cookie info)
      return { userId: result.userId, user: { id: result.userId }, rotatedCookie: result.cookie, newRefreshToken: result.refreshToken };
    }
  }

  // Fallback unauthorized
  throw new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
}

/**
 * requireSessionOrRedirect - Helper for middleware contexts.
 * If session not found, returns a NextResponse redirect to /login.
 */
export async function requireSessionOrRedirect(req: NextRequest) {
  const user = await getUserFromAuthHeader(req);

  if (!user?.id) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return null; // indicates OK to continue
}

/**
 * verifySessionCookie - Verify a session token stored in httpOnly cookie.
 * Stub implementation; replace with real lookup against session store.
 */
export async function verifySessionCookie(req: NextRequest) {
  try {
    const cookie = req.cookies.get("vf_session")?.value || null;
    if (!cookie) return null;

    // Example: look up session row in Supabase
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("session_token", cookie)
      .limit(1)
      .single();

    if (error || !data) return null;

    // Example returned shape: { user_id, expires_at, refresh_token }
    const now = new Date();
    const expiresAt = new Date(data.expires_at);
    if (expiresAt < now) {
      // Session expired; caller may attempt refresh
      return { expired: true, session: data };
    }

    return { userId: data.user_id, session: data };
  } catch (e) {
    console.error("verifySessionCookie error", e);
    return null;
  }
}

/**
 * refreshSessionTokens - Attempt to refresh a session using the refresh token.
 * Stub: implement rotation, revocation, and secure cookie replacement.
 */
export async function refreshSessionTokens(refreshToken: string) {
  try {
    if (!refreshToken) return { success: false, error: "Missing refresh token" };

    // Look up existing session row by refresh token
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("refresh_token", refreshToken)
      .limit(1)
      .single();

    if (error || !data) return { success: false, error: "Invalid refresh token" };

    // Optionally check for revocation, last_used, etc.
    // Generate new tokens
    const newSessionToken = crypto.randomUUID();
    const newRefreshToken = crypto.randomUUID();

    // Compute new expiry (seconds)
    const maxAgeSeconds = 60 * 60 * 24 * 7; // 7 days
    const expiresAt = new Date(Date.now() + maxAgeSeconds * 1000).toISOString();

    // Update DB row: rotate tokens (rotate refresh_token)
    const { error: updateError } = await supabase
      .from("sessions")
      .update({
        session_token: newSessionToken,
        refresh_token: newRefreshToken,
        expires_at: expiresAt,
        last_rotated_at: new Date().toISOString(),
      })
      .eq("id", data.id);

    if (updateError) return { success: false, error: updateError.message };

    // Return cookie information so caller can set httpOnly cookie
    const cookie = {
      name: "vf_session",
      value: newSessionToken,
      opts: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: maxAgeSeconds,
      },
    };

    return {
      success: true,
      userId: data.user_id,
      cookie,
      refreshToken: newRefreshToken,
    };
  } catch (e: any) {
    console.error("refreshSessionTokens error", e);
    return { success: false, error: e?.message || "Unknown error" };
  }
}

/**
 * setSessionCookieOnResponse - Helper to attach secure cookies to NextResponse.
 * Use on server-side routes / middleware to set cookies with proper flags.
 */
export function setSessionCookieOnResponse(res: NextResponse, name: string, value: string, opts?: { maxAge?: number }) {
  const maxAge = opts?.maxAge ?? 60 * 60 * 24 * 7; // 7 days
  // Secure flags: httpOnly, secure, sameSite=strict
  // NextResponse.cookies.set API differs by Next version; adapt as needed.
  try {
    res.cookies.set({
      name,
      value,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge,
    });
  } catch (e) {
    // Fallback: set header manually (older Next versions)
    const cookieStr = `${name}=${value}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Strict${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
    res.headers.set("Set-Cookie", cookieStr);
  }
}

/**
 * revokeSession - Remove session row and clear cookie.
 */
export async function revokeSession(sessionToken: string) {
  // Example: delete session row from Supabase
  const { error } = await supabase.from("sessions").delete().eq("session_token", sessionToken);
  if (error) {
    console.error("revokeSession error", error);
    return { success: false, error: error.message };
  }
  return { success: true };
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
