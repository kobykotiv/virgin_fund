import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Add matcher for routes that need authentication
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/portfolio/:path*",
    "/backtest/:path*",
    "/monitoring/:path*",
  ],
}

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth-token")?.value
  const isDemo = request.cookies.get("demo-mode")?.value === "true"

  // Allow access if user is authenticated or in demo mode
  if (authToken || isDemo) {
    return NextResponse.next()
  }

  // Redirect to login if not authenticated
  const loginUrl = new URL("/login", request.url)
  loginUrl.searchParams.set("from", request.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}