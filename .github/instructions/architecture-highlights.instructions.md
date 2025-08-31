# Architecture Highlights for Virgin Fund

## Database Schema
- Tables for users, bots, strategies, trades, follows, posts, api_keys, backtests, notifications. Use RLS for security.

## API Routes
- RESTful endpoints for CRUD operations, protected by auth middleware. Example: `/api/bots` (list/create), `/api/market/:symbol` (cached data).

## Real-Time
- Supabase real-time for live updates; WebSockets for market data.

## Security
- Encrypted API keys, rate limiting, audit logs, GDPR compliance.

## Performance
- Code splitting, ISR for static pages, caching with Redis/Upstash.

## Testing
- Unit tests (Jest), integration (Playwright), E2E for critical flows.

## CI/CD
- GitHub Actions for lint, build, deploy; auto-scaling with Vercel.
