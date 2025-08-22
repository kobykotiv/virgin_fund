## Brief overview
- Project-specific testing and CI guidelines for the virgin_fund repo.
- Purpose: ensure reliable unit/integration tests, consistent mocking strategies for external services (Supabase, Alpaca), and CI-friendly test execution using Vitest and Bun.

## Testing frameworks & CI
- Use Vitest as the primary test runner for unit and integration tests.
- Run tests in CI with Bun-compatible runners. Ensure vitest.config.ts and vitest.setup.ts are present and used by CI.
- Prefer fast, hermetic tests in CI (mock external network calls). Avoid hitting real Supabase or external APIs in CI.

## Unit tests
- Place unit tests under `__tests__/` and mirror feature folders (e.g., `__tests__/api/`, `__tests__/lib/`).
- Test naming: use `.test.ts` suffix (example: `login.test.ts`) and keep one logical unit per test file.
- Mock external dependencies:
  - Mock `@supabase/supabase-js` clients for all server-side tests that would otherwise call Supabase.
  - Mock `lib/session` helpers when testing routes that depend on DB rows to avoid needing a real DB.
  - Mock network calls to Alpaca, market-data providers, and other external services.
- Keep assertions focused: verify behavior (Set-Cookie headers, status codes, JSON payloads) rather than implementation details.

## Integration tests
- Integration tests that exercise multiple modules are allowed but must still mock third-party network interactions.
- Use dedicated integration test fixtures and isolated test data. Prefer local in-memory fixtures rather than a real DB in CI.
- If a live integration test is required, gate it behind explicit env flags and run only in approved staging jobs.

## Mocking & test doubles
- Use Vitest's mocking utilities (vi.mock) to intercept and control external modules.
- Provide clear mock implementations in `__tests__/mocks/` if reused across tests.
- For Supabase admin revocation behavior, mock `lib/supabaseAdmin.getSupabaseAdmin()` and assert that `auth.admin.revokeRefreshTokensForUser` is called when `SESSION_REVOKE_SUPABASE=true`.

## Test setup & fixtures
- Centralize global test setup in `vitest.setup.ts` (already present).
- Keep small, deterministic fixtures; avoid flaky timing-based assertions.
- Use fixed timestamps where relevant to assert expiry/rotation behavior.

## Test data & secrets
- Do not store real secrets or service-role keys in repo or test fixtures.
- Use `.env.test` or CI-provided secrets for any integration tests that must touch real services, and gate these tests explicitly.
- For unit tests, use fake IDs and tokens only.

## Coverage & thresholds
- Track coverage but avoid rigid thresholds that block minor PRs. Use coverage reports to identify untested areas and prioritize tests for critical flows (auth, payments, trading operations).

## CI behavior
- CI should:
  - Install deps with Bun (project policy).
  - Run linter and Vitest in a single job or parallel jobs as configured.
  - Avoid network calls during the default test job; have a separate gated job for optional live integration tests.
- Cache node_modules/bun cache per CI runner to speed builds.

## Example trigger cases
- Adding a logout endpoint: add unit tests that:
  - Mock `revokeSession` and assert it is called.
  - Verify `Set-Cookie` header contains `Max-Age=0`.
  - When `SESSION_REVOKE_SUPABASE=true`, mock admin client and assert revoke API invoked.
- Adding session rotation: test that `refreshSession` rotates tokens and returns cookie metadata.

## Communication & PR expectations
- When adding tests, include:
  - Files changed (brief list)
  - Which behaviors are being covered
  - Any new env vars required for tests
- If a test requires network access, document why and how it should be gated.
