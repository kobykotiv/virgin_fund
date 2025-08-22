import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/session";

/**
 * Simple middleware to validate vf_session cookie and attach minimal user/session
 * information to the request via response headers (x-vf-user-id, x-vf-session-id).
 *
 * - Skips public and static paths.
 * - Uses verifySessionToken to check session validity.
 *
 * Notes:
 * - Keep this middleware lightweight; verifySessionToken performs a DB lookup.
 * - For API routes we return 401 JSON; for page routes we redirect to /login.
 */

const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/api/auth",
  "/_next",
  "/favicon.ico",
  "/public",
  "/assets",
  "/static",
];

function isPublicPath(pathname: string) {
  if (!pathname) return false;
  for (const p of PUBLIC_PATHS) {
    if (pathname === p) return true;
    if (pathname.startsWith(p + "/")) return true;
    if (pathname.startsWith(p)) return true;
  }
  return false;
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Allow next internals and explicitly public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get("vf_session")?.value || null;

  // No cookie -> unauthorized
  if (!cookie) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // Verify session token
  try {
    const session = await verifySessionToken(cookie);
    if (!session || (session as any).expired) {
      // Expired/invalid
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Session invalid or expired" }, { status: 401 });
      }
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      return NextResponse.redirect(loginUrl);
    }

    // Attach minimal identifying headers for downstream handlers (server components / api)
    const res = NextResponse.next();
    try {
      if ((session as any).user_id) res.headers.set("x-vf-user-id", (session as any).user_id);
      if ((session as any).id) res.headers.set("x-vf-session-id", (session as any).id);
    } catch (err) {
      // ignore header set failures
    }
    return res;
  } catch (err) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Session verification failed" }, { status: 401 });
    }
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }
}

/**
 * Optional matcher can be tuned to include/exclude specific routes.
 * Leaving default matcher so middleware runs for all routes; PUBLIC_PATHS handles skips.
 */
