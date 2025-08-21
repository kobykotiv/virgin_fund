import { NextRequest, NextResponse } from "next/server";
import { revokeSession } from "../../../../lib/session";

/**
 * POST /api/auth/logout
 * Reads cookie vf_session and revokes session row, clears cookie.
 */
export async function POST(req: NextRequest) {
  try {
    const cookie = req.cookies.get("vf_session")?.value || null;
    if (!cookie) {
      return NextResponse.json({ success: true }, { status: 200 }); // idempotent
    }

    await revokeSession(cookie);

    // Clear cookie
    const res = NextResponse.json({ success: true }, { status: 200 });
    res.headers.set("Set-Cookie", `vf_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict`);
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: (err && err.message) || "Logout failed" }, { status: 500 });
  }
}
