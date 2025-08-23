# Progress Report — 2025-08-23

**Summary of Next Planned Change:**  
Extend bot CRUD UI for strategy/asset assignment and cloning.

---

**Summary of completed tasks:**
- Integrated CoinGecko and Alpaca APIs for unified, source-annotated market data.
- Updated UI to display asset data sources in bot views.

**Current status:**
- Market data integration is architecturally complete and live.
- Bot management flows (CRUD) are functional and extensible.

**Outstanding tasks:**
1. Extend bot CRUD UI for strategy/asset assignment and cloning.
2. Implement watchlist CRUD and alert logic.
3. Build trade history and performance chart views in `ExpertView`.
4. Polish UI/UX with animation and accessibility improvements.

**Blockers or questions:**
-

---

# Progress Update — API Key Management & Sessions

Date: 2025-08-21

## Summary of Next Planned Change
- Review and remove legacy session helpers; consolidate documentation and README.
- Ensure lib/encryption.ts is consolidated into lib/crypto.ts and update any remaining consumers.

## Current Progress
- [x] Create lib/session.ts (create/verify/refresh/revoke)
- [x] Update supabase sessions migration (if needed) (left for DB migration step)
- [x] Add /api/auth/login route
- [x] Add /api/auth/refresh route
- [x] Add /api/auth/logout route
- [x] Update middleware.ts to protect pages + set x-user-id
- [x] Update frontend useAuth to use cookie-based flows
- [x] Add Vitest tests for login/refresh/logout and reveal protection (basic)
- [x] Add simple rate-limiter utility (utils/rateLimiter.ts) and wire to login endpoint
- [x] Wire rate-limiter into reveal endpoints and complete hardening
- [ ] Review and remove legacy session helpers; consolidate docs/README

## Notes
- Current completion: 10/11 (91%).
- Recent changes: wired rate-limiter into `GET /api/keys/:id?reveal=true` and enforced `requireRecentSession` in server-side reveal flow.
- Next atomic action: remove legacy session helper files, consolidate session logic into `lib/session.ts`, update documentation, and ensure all API routes and tests import the canonical session helper.
- Security reminder: KEY_ENCRYPTION_KEY must remain secret and set in CI/production environment variables; do not commit.
