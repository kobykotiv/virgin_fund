import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/session";
import { setResponseCookie } from "@/lib/serverCookies";

/**
 * POST /api/auth/login
 *
 * Body: { email, password }
 *
 * - Authenticates via supabaseAdmin.auth.signInWithPassword
 * - On success creates a server session row (lib/session.createSession)
 *   and sets an httpOnly SameSite=Strict cookie (vf_session) using setResponseCookie.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

  // Sign in with Supabase (service role client)
  // Dynamically import the admin module so vitest's vi.mock() replacements are returned.
    const adminMod = await import("@/lib/supabaseAdmin");
    // Prefer default export (tests often mock `default`). If the mock provides a getSupabaseAdmin()
    // helper, call it. Otherwise fall back to the module itself.
    let supabase: any = adminMod.default ?? adminMod;
    if (!supabase && typeof (adminMod as any).getSupabaseAdmin === "function") {
      supabase = (adminMod as any).getSupabaseAdmin();
    }
    if (!supabase) supabase = adminMod as any;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data?.user) {
      console.error("login failed:", error?.message ?? error);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const userId = data.user.id;

    // Create server session (rows in `sessions` table) and get cookie info
    const { cookie } = await createSession(userId);

    const res = NextResponse.json({ ok: true }, { status: 200 });
    // Use shared helper to set cookie correctly for app-router runtimes
    setResponseCookie(res, cookie);
    return res;
  } catch (err) {
    console.error("auth/login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
