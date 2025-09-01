# Alpaca OAuth integration

This document describes the minimal OAuth2 flow used to connect a user Alpaca account to this app.

1. Register your OAuth app at Alpaca and add your redirect URI (e.g., `https://your-site.com/api/alpaca/callback`).
2. Configure these environment variables (see `.env.example`).
3. The frontend opens `/api/alpaca/authorize` in a popup. That route redirects the user to Alpaca's authorize page.
4. After user authorizes, Alpaca redirects to `/api/alpaca/callback?code=...&state=...`.
5. The callback route exchanges the code server-side and persists the token (server-only). The callback page then posts a message to the opener and closes.

Security notes
- Never expose `ALPACA_CLIENT_SECRET` to the browser.
- Use the `state` parameter to protect against CSRF and to restore `returnTo` navigation.
- Store tokens encrypted at rest and rotate keys as needed.

TODOs
- Wire `persistToken` and `getTokenForUser` in `lib/server/alpaca.ts` to your DB and auth system.
- Implement refresh token handling and revoke endpoint.
