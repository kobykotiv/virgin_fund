## Brief overview
- Project-specific guidelines for authentication/session handling and logout behavior.
- Purpose: document conventions for session creation, cookie handling, and optional Supabase-side session revocation so future changes remain consistent and testable.

## Cookie & Session handling
- Use a single httpOnly cookie named `vf_session` by default (configurable via `SESSION_COOKIE_NAME`).
- Cookies must be set with:
  - HttpOnly: true
  - SameSite: Strict
  - Secure: set when `NODE_ENV === "production"`
  - Path: `/`
  - Max-Age: set to session expiration (seconds)
  - Example header: `vf_session=<token>; Path=/; Max-Age=0; HttpOnly; SameSite=Strict; Secure` (production)
- Store short opaque session tokens in the app-specific `sessions` table; do not store Supabase service-role keys or refresh tokens in client code.

## Server session lifecycle
- createSession:
  - Insert a session row (`session_token`, `refresh_token`, `user_id`, `expires_at`, `issued_at`, `last_used_at`, `revoked`).
  - Return cookie metadata for route handlers to set.
- verifySessionToken:
  - Return null for missing/expired/revoked rows.
  - Update `last_used_at` on successful verification (best-effort).
- refreshSession:
  - Rotate both `session_token` and `refresh_token` on use (single-use semantics).
  - Update `expires_at` and `last_rotated_at`.
- revokeSession:
  - Primary behavior: mark the `sessions` row as revoked (idempotent).
  - Optional behavior: when `SESSION_REVOKE_SUPABASE="true"`, attempt a best-effort Supabase admin revoke (e.g., `auth.admin.revokeRefreshTokensForUser(userId)`), but never rely on this for logout success.

## Supabase admin revocation (opt-in)
- Gate admin-side revocation behind an env var: `SESSION_REVOKE_SUPABASE=true`.
- Require `SUPABASE_SERVICE_ROLE_KEY` (admin client) for any admin calls.
- Treat admin revocation as best-effort:
  - Do not throw or fail logout flow if admin API is unavailable.
  - Log warnings when revoke fails; keep cookie-clearing idempotent and primary.
- Rationale: protects against long-lived Supabase refresh tokens in edge cases, but avoids breaking logout when admin APIs change.

## Environment & configuration
- Required at runtime for admin operations:
  - SUPABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY
  - (Optional) SESSION_REVOKE_SUPABASE = "true"
- Cookie-related envs:
  - SESSION_COOKIE_NAME (defaults to `vf_session`)
  - SESSION_MAX_AGE_SECONDS
- Security requirement: never expose service-role keys in client bundles or checked-in files.

## Testing & mocks
- Unit tests should mock:
  - Supabase clients (`createClient`) and admin methods.
  - lib/session functions (createSession, refreshSession, revokeSession) for route tests.
- Test cases to include:
  - Login sets `Set-Cookie` header with `vf_session` and correct flags.
  - Refresh rotates tokens and sets new cookie.
  - Logout clears cookie (Max-Age=0) and remains idempotent when no cookie present.
  - When `SESSION_REVOKE_SUPABASE=true`, assert revokeSession attempts admin revoke (mock admin client).
- Use Vitest for unit tests; prefer mocking over hitting real Supabase in CI.

## Development workflow & edits
- Prefer targeted edits (replace_in_file style) for minimal risk when changing existing files.
- Use full-file writes only for new rule files or when restructuring a file completely.
- Document any new env or behavioral change in TASKS.md or PROGRESS.md with a short "Summary of Changes".
- Follow existing .clinerules for broader team rules (Bun usage, TypeScript, Next.js, Tailwind).

## Communication style
- Keep messages concise, technical, and action-oriented.
- When requesting permission for impactful actions (installing deps, running migrations, running tests with network access), ask a single clear question and propose a recommended default.
- When reporting changes, include:
  - Files changed
  - Short summary of behavior change
  - Any new env vars required

## Example trigger cases
- Adding logout endpoint: clear cookie (always) and call revokeSession(token). If support for Supabase revoke is desired, set `SESSION_REVOKE_SUPABASE=true` and ensure admin key is present.
- Rotating sessions: implement `refreshSession` to update DB and return cookie metadata for the handler to set.

## Other guidelines
- Keep server-side session logic inside `lib/session.ts` and Supabase admin client in `lib/supabaseAdmin.ts`.
- Do not change cookie flags or session semantics without documenting the reason and updating tests.
