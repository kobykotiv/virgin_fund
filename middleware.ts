import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "./lib/session";

const DASHBOARD_PATH = "/app/(dashboard)";

/**
 * Middleware:
 * - Protect dashboard routes by verifying server-side session cookie `vf_session`.
 * - If valid, set `x-user-id` header forwarded to downstream server handlers.
 * - If invalid or missing, redirect to /login.
 *
 * Notes:
 * - The middleware is intentionally lightweight. More checks (IP/user-agent, rate-limits)
 *   should be applied at the auth endpoints themselves.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect dashboard routes
  if (pathname.startsWith(DASHBOARD_PATH)) {
    const sessionCookie = request.cookies.get("vf_session")?.value || null;

    if (!sessionCookie) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const verification = await verifySessionToken(sessionCookie);
      // verifySessionToken returns null | { expired: true, session } | sessionRow
      if (!verification) {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
      }

      if ((verification as any).expired) {
        // expired session -> redirect to login (refresh handled via /api/auth/refresh explicitly)
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
      }

      const sessionRow = verification as any;
      const userId = sessionRow.user_id;

      // Forward x-user-id header to downstream handlers
      const headers = new Headers(request.headers);
      headers.set("x-user-id", userId);

      return NextResponse.next({
        request: {
          // Forward modified headers
          headers,
        },
      } as any);
    } catch (e) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Specify which paths to match
export const config = {
  matcher: ["/app/(dashboard)/:path*"]
};
