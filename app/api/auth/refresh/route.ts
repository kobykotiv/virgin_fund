import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, refreshSession, COOKIE_NAME } from "../../../../lib/session";
import { setResponseCookie, clearResponseCookie } from "../../../../lib/serverCookies";

/**
 * POST /api/auth/refresh
 *
 * Flow:
 *  - Read session cookie (vf_session)
 *  - If session is valid and not expired, return 200 (no-op).
 *  - If session is expired but a row exists with a refresh_token, call refreshSession(refresh_token) to rotate tokens.
 *  - Set new httpOnly cookie when rotation succeeds.
 *
 * Notes:
 *  - This endpoint is idempotent-safe: calling when session valid returns 200.
 *  - For extra safety you can require a short cooldown or additional checks (IP/user-agent).
 */

export async function POST(req: NextRequest) {
  try {
    const cookie = req.cookies.get(COOKIE_NAME)?.value || null;
    if (!cookie) {
      return NextResponse.json({ error: "No session cookie" }, { status: 401 });
    }

    const verification = await verifySessionToken(cookie);

    // If verification is null -> no session found
    if (!verification) {
      return NextResponse.json({ error: "Session not found" }, { status: 401 });
    }

    // If verification indicates expired with session blob, attempt rotation
    if ((verification as any).expired && (verification as any).session) {
      const sessionRow = (verification as any).session;
      const refreshToken = sessionRow.refresh_token;
      if (!refreshToken) return NextResponse.json({ error: "No refresh token available" }, { status: 401 });

      const result = await refreshSession(refreshToken);
      if (!result.success) {
        return NextResponse.json({ error: result.error || "Refresh failed" }, { status: 401 });
      }

      const res = NextResponse.json({ success: true }, { status: 200 });
      if (result.cookie) {
        setResponseCookie(res, result.cookie);
      } else {
        // ensure cookie cleared if no cookie returned
        clearResponseCookie(res, COOKIE_NAME);
      }
      return res;
    }

    // If verification returned a valid session (not expired), nothing to do.
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: (err && err.message) || "Refresh failed" }, { status: 500 });
  }
}
