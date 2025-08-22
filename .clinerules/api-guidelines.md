## Brief overview
- Project-specific API guidelines for server-side routes, integrations, and backend behavior.
- Purpose: keep API surface consistent, secure, and testable across Next.js route handlers and server logic.

## API design & routing
- Use Next.js App Router route handlers under `app/api/*` for server endpoints.
- Keep handlers small and focused; split complex logic into `lib/` helpers (e.g., `lib/session.ts`, `lib/supabaseAdmin.ts`).
- Use TypeScript types for request/response shapes and exported handler signatures.
- Design endpoints to return minimal, stable JSON shapes for clients (avoid leaking internal errors).

## Security & auth
- Enforce server-side verification for sensitive routes (use `lib/session.verifySessionToken` or middleware).
- Use `vf_session` httpOnly cookie for authenticated flows; do not read secrets from client code.
- Gate admin actions (e.g., Supabase admin revoke) behind env vars (`SESSION_REVOKE_SUPABASE`) and require `SUPABASE_SERVICE_ROLE_KEY`.
- Validate and sanitize all incoming data before using in DB or external calls.

## Error handling & status codes
- Return proper HTTP status codes:
  - 200 for success
  - 400 for bad request / validation failure
  - 401 for authentication failure
  - 403 for authorization failure
  - 404 for missing resources
  - 500 for unexpected server errors (log details server-side)
- Log internal errors server-side but return minimal messages to clients.

## Idempotency & rate-limiting
- Use `idempotency_keys` table for endpoints that can be retried (e.g., order placement).
- Design long-running operations to be asynchronous and report status via a pollable endpoint or WebSocket/event feed.
- Consider rate limiting on public APIs or costly operations (implement at edge or reverse-proxy if needed).

## Integration with third-parties
- Wrap third-party clients (Alpaca, market-data) in adapter modules under `lib/` to centralize retries, timeouts, and error mapping.
- Mock these adapters in tests; avoid direct network calls in unit tests or default CI.
- Keep service credentials in environment variables and never check them in code.

## Schema & migrations (coordination)
- For PRs that change DB schema, add SQL migration files under `supabase/migrations/` with timestamped filenames and a short summary.
- Do not run migrations without explicit approval and environment access — provide SQL and instructions for running in staging.
- Document any schema changes in migration comments and in the PR description.

## Monitoring & observability
- Emit structured logs for critical operations (auth, orders, webhooks).
- Track failures and important events (order errors, revocations, token rotations).
- Expose lightweight health/readiness endpoints for infra checks.

## Testing & CI
- Unit-test route handlers with mocked `lib/` helpers (e.g., mock `lib/session`, `lib/supabaseAdmin`).
- Use Vitest and Bun-compatible CI as per repo standards.
- Add integration tests only when they can run reliably with mocked external services or gated env vars.

## Example trigger cases
- Adding POST `/api/auth/logout`: clear `vf_session` cookie (always) and call `revokeSession(token)`; if `SESSION_REVOKE_SUPABASE=true`, attempt admin revoke (best-effort).
- Creating an order endpoint: use idempotency key, validate payload strictly, call adapter in `lib/alpaca-...` and persist order_records.

## Communication expectations
- When proposing API changes, include:
  - Files modified
  - Contract changes (request/response shapes)
  - Any new env vars required
  - Migration SQL and rationale
