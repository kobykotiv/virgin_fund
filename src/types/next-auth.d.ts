// Augment NextAuth types to include application-specific user/session fields.
// This prevents repeated `as any` casts when reading `session.user.isDemoMode`,
// `apiKey`, `secretKey`, etc.
//
// Keep this file minimal and explicit — expand fields as needed.
//
// Note: Type augmentations must be under a module with the same name as the package.
import 'next-auth'

declare module 'next-auth' {
  // Add additional properties we store on the session.user object.
  // All fields are optional to avoid forcing callers to always provide them.
  interface Session {
    user?: {
      id?: string
      name?: string | null
      email?: string | null
      // feature flag used throughout the codebase
      isDemoMode?: boolean
      // optional API credentials stored on the session in some flows
      apiKey?: string | null
      secretKey?: string | null
      // indicates paper trading preference
      isPaper?: boolean
      // allow other arbitrary fields if needed
      [key: string]: any
    }
  }

  // Also augment User if code reads user directly (server-side helpers)
  interface User {
    id?: string
    name?: string | null
    email?: string | null
    isDemoMode?: boolean
    apiKey?: string | null
    secretKey?: string | null
    isPaper?: boolean
    [key: string]: any
  }
}
