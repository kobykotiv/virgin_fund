import { NextRequest, NextResponse } from "next/server";
import { revokeSession, COOKIE_NAME } from "../../../../lib/session";
import { setResponseCookie, clearResponseCookie } from "../../../../lib/serverCookies";

/**
 * POST /api/auth/logout
 * Reads cookie vf_session and revokes session row, clears cookie.
 *
 * If process.env.SESSION_REVOKE_SUPABASE === "true" then revokeSession will
 * attempt to revoke Supabase auth refresh tokens for the user (best-effort).
 */
export async function POST(req: NextRequest) {
  try {
    const cookie = req.cookies.get(COOKIE_NAME)?.value || null;

    const res = NextResponse.json({ success: true }, { status: 200 }); // idempotent

    if (!cookie) {
      clearResponseCookie(res, COOKIE_NAME);
      return res;
    }

    await revokeSession(cookie);

    // Clear cookie
    clearResponseCookie(res, COOKIE_NAME);
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: (err && err.message) || "Logout failed" }, { status: 500 });
  }
}
