# Alpaca Deployment checklist

Environment variables (example):
- ALPACA_CLIENT_ID
- ALPACA_CLIENT_SECRET
- ALPACA_REDIRECT_URI
- ALPACA_ENV (paper | live)
- NEXT_PUBLIC_SITE_URL (used to construct redirect fallback)

Deployment notes
- Keep `ALPACA_CLIENT_SECRET` in your secret manager (Vercel/Netlify/Cloud provider) and never commit it.
- For local dev use the Alpaca paper environment.
- Verify redirect URI in Alpaca dashboard matches `ALPACA_REDIRECT_URI` exactly (including protocol).

Operational
- Provide an admin-run command to revoke tokens for a user in case of compromise.
- Monitor API errors and rate limits. Implement retries with backoff for idempotent operations.
