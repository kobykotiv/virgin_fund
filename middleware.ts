import { NextRequest, NextResponse } from "next/server";

const DASHBOARD_PATH = "/app/(dashboard)";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Only protect dashboard routes
  if (pathname.startsWith(DASHBOARD_PATH)) {
    // Example: check for a session cookie (customize as needed)
    const isAuthenticated = request.cookies.has("session_token");
    if (!isAuthenticated) {
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
