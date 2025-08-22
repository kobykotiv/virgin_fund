# Supabase Server-Side Auth (server session + magic link)

Summary
- Server-side session storage: sessions table is used to store opaque session_token and refresh_token.
- Client signs in via UI which calls:
  - POST /api/auth/login -> validates credentials via supabaseAdmin.auth.signInWithPassword, creates a server session row and sets an httpOnly cookie `vf_session`.
  - POST /api/auth/magic -> triggers Supabase signInWithOtp (magic link).

Required environment variables
- SUPABASE_URL - Supabase project URL (https://...)
- SUPABASE_SERVICE_ROLE_KEY - Supabase service role key (server-only)
- NEXT_PUBLIC_SITE_URL - Public site URL for magic link redirect (optional)
- KEY_ENCRYPTION_KEY - base64-encoded 32 byte key used by lib/crypto (required for some utilities)
- SESSION_COOKIE_NAME - optional name for session cookie (defaults to `vf_session`)
- SESSION_MAX_AGE_SECONDS - session TTL in seconds (defaults to 7 days)

Cookie policy
- Cookies set by server are:
  - httpOnly
  - SameSite=Strict
  - Secure when NODE_ENV=production
  - Path=/
  - Max-Age determined by SESSION_MAX_AGE_SECONDS
- Do not store Supabase service role or raw refresh tokens in client-accessible cookies. Cookies should contain only an opaque session token.

Security notes and rotation
- Implement refresh endpoint (/api/auth/refresh) that accepts refresh token and rotates both session_token and refresh_token (see lib/session.refreshSession).
- Revoke sessions on logout (/api/auth/revoke or sign-out).
- Consider adding rate limiting and device fingerprint checks to auth endpoints.

Testing notes
- Tests mock `lib/supabaseAdmin` and `lib/session` to avoid using real Supabase during unit tests.
- Use the provided Vitest setup file and ensure KEY_ENCRYPTION_KEY is set in the test environment.
