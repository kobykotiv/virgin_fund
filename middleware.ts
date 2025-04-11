import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Function to get the user's authentication status from the request
function isAuthenticated(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value
  const isLoggedIn = request.cookies.get('isAuthenticated')?.value === 'true'
  return !!authToken || isLoggedIn
}

// Function to get the user's admin status from the request
function isAdmin(request: NextRequest) {
  return request.cookies.get('isAdmin')?.value === 'true'
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Public paths that don't require authentication
  const publicPaths = ['/login', '/forgot-password', '/reset-password']
  const isPublicPath = publicPaths.includes(pathname)

  // Admin-only paths
  const adminPaths = ['/admin', '/content-manager']
  const isAdminPath = adminPaths.some(path => pathname.startsWith(path))

  // Check authentication
  const authenticated = isAuthenticated(request)
  const admin = isAdmin(request)

  // Redirect unauthenticated users to login
  if (!authenticated && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect authenticated users away from login page
  if (authenticated && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Handle admin routes
  if (isAdminPath && !admin) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // For non-authenticated users trying to access the root, show the landing page
  if (pathname === '/' && !authenticated) {
    return NextResponse.rewrite(new URL('/landing', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all paths except static files and api routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}