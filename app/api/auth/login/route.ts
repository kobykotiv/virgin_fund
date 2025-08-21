import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSession } from "../../../../lib/session";
import { check, keyFromRequest } from "../../../../utils/rateLimiter";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * POST /api/auth/login
 * Body: { email: string, password: string }
 *
 * Flow:
 *  - Validate payload
 *  - Call Supabase signInWithPassword (delegates auth to Supabase)
 *  - On success, create server-side session row and set httpOnly cookie
 *  - Return safe user metadata
 *
 * Notes:
 *  - Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars
 *  - Cookie flags are set by lib/session.createSession
 */

function getSupabase() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase environment variables are not configured");
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const supabase = getSupabase();

    // Rate-limit login attempts by client IP/address
    try {
      const key = keyFromRequest(req as unknown as Request, "login");
      const allowed = await check(key, 5, 60_000); // 5 attempts per minute
      if (!allowed) {
        return NextResponse.json({ error: "Too many login attempts" }, { status: 429 });
      }
    } catch (e) {
      // If rate limiter fails, continue (fail-open) but log in production
      console.warn("rate-limiter error", e);
    }

    // Attempt to sign in via Supabase
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data?.user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const userId = data.user.id;

    // Create server-side session and cookie
    const { cookie } = await createSession(userId);

    // Build Set-Cookie header (NextResponse.cookies API used in middleware elsewhere may differ)
    const cookieParts = [];
    cookieParts.push(`${cookie.name}=${cookie.value}`);
    cookieParts.push(`Path=${cookie.opts.path || "/"}`);
    cookieParts.push(`Max-Age=${cookie.opts.maxAge}`);
    cookieParts.push(`SameSite=${cookie.opts.sameSite}`);
    if (cookie.opts.httpOnly) cookieParts.push("HttpOnly");
    if (cookie.opts.secure) cookieParts.push("Secure");

    const res = NextResponse.json({ user: { id: userId, email: data.user.email } }, { status: 200 });
    res.headers.set("Set-Cookie", cookieParts.join("; "));

    return res;
  } catch (err: any) {
    return NextResponse.json({ error: (err && err.message) || "Login failed" }, { status: 500 });
  }
}
