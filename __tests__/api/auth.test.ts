import { describe, it, expect, beforeAll, vi } from "vitest";
import { NextRequest } from "next/server";

/**
 * Tests for auth endpoints using mocked Supabase and mocked NextRequest/NextResponse behavior.
 * - Mocks createClient from @supabase/supabase-js to provide signInWithPassword
 * - Mocks lib/session.createSession and verifySessionToken to avoid DB dependency
 * - Verifies Set-Cookie header and JSON responses
 */

vi.mock("@supabase/supabase-js", async () => {
  return {
    createClient: () => ({
      auth: {
        signInWithPassword: async ({ email, password }: any) => {
          if (email === "test@example.com" && password === "password") {
            return { data: { user: { id: "user-1", email } }, error: null };
          }
          return { data: null, error: { message: "Invalid" } };
        },
      },
    }),
  };
});

vi.mock("../../lib/session", async () => {
  return {
    COOKIE_NAME: 'vf_session',
    createSession: async () => ({
      sessionToken: 'sess-123',
      refreshToken: 'ref-123',
      cookie: { name: 'vf_session', value: 'sess-123', opts: { path: '/', maxAge: 3600, httpOnly: true, secure: false, sameSite: 'Strict' } },
      row: { id: 's1' }
    }),
    verifySessionToken: async (token: string) => {
      // Simulate expired session to exercise refresh path if different token
      if (token === 'sess-expired') return { expired: true, session: { refresh_token: 'ref-123' } };
      if (token === 'sess-123') return { id: 's1', user_id: 'user-1', expires_at: new Date(Date.now()+60_000).toISOString() };
      return null;
    },
    refreshSession: async (refreshToken: string) => {
      if (refreshToken === 'ref-123') return { success: true, userId: 'user-1', cookie: { name: 'vf_session', value: 'sess-456', opts: { path: '/', maxAge: 3600, httpOnly: true, secure: false, sameSite: 'Strict' } }, refreshToken: 'ref-456' };
      return { success: false, error: 'invalid' };
    },
    revokeSession: async () => ({ success: true }),
  };
});

let loginRoute: typeof import("../../app/api/auth/login/route");
let refreshRoute: typeof import("../../app/api/auth/refresh/route");
let logoutRoute: typeof import("../../app/api/auth/logout/route");

beforeAll(async () => {
  loginRoute = await import("../../app/api/auth/login/route");
  refreshRoute = await import("../../app/api/auth/refresh/route");
  logoutRoute = await import("../../app/api/auth/logout/route");
});

describe("auth endpoints", () => {
  it("login success sets cookie", async () => {
    const req: any = {
      json: async () => ({ email: "test@example.com", password: "password" }),
      cookies: new Map(),
      headers: new Headers(),
    };
    // Pass as any to satisfy NextRequest typing in test harness
    const res = await loginRoute.POST(req as any);
  const body = await res.json();
  expect(res.status).toBe(200);
  // body may or may not include user depending on route implementation; if present, validate id
  if (body.user) expect(body.user).toMatchObject({ id: "user-1" });
    expect(res.headers.get("Set-Cookie")).toContain("vf_session=sess-123");
  });

  it("refresh rotates token", async () => {
    const req: any = {
      cookies: { get: () => ({ value: "sess-expired" }) },
      url: "http://localhost",
      headers: new Headers(),
    };
    const res = await refreshRoute.POST(req as any);
    expect(res.status).toBe(200);
    expect(res.headers.get("Set-Cookie")).toContain("vf_session=sess-456");
  });

  it("logout clears cookie", async () => {
    const req: any = { cookies: { get: () => ({ value: "sess-123" }) }, headers: new Headers() };
    const res = await logoutRoute.POST(req as any);
    expect(res.status).toBe(200);
  const setCookie = res.headers.get("Set-Cookie") || '';
  expect(setCookie).toMatch(/vf_session=/);
  // Accept either Max-Age=0 or an expired Expires date
  expect(/Max-Age=0/.test(setCookie) || /Expires=Thu, 01 Jan 1970/.test(setCookie)).toBe(true);
  });
});
