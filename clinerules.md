# Cline Rules for Trading Bot PaaS Project

## General Guidelines
- **Stack Adherence**: Use React + TypeScript + Tailwind + shadcn/ui + React Query + Supabase. Avoid external libraries unless specified (e.g., Framer Motion for animations).
- **File Structure**: Follow the provided `/frontend` and `/backend` layouts. Place components in `/components`, hooks in `/hooks`, API routes in `/app/api`.
- **Security**: Encrypt sensitive data (e.g., API keys) using AES-GCM. Require user auth for all endpoints.
- **Performance**: Implement caching (as in CoinGecko route), use React Query for data fetching, and virtualize lists for large datasets.
- **Error Handling**: Show loading, empty, and error states in UI. Log errors to console.
- **Git Commits**: Every 2nd iteration, commit with a meaningful message (e.g., "feat: add bot overview grid with filters").

## Component Patterns
- Use shadcn/ui for consistent styling (cards, buttons, tables).
- Animate with Framer Motion for transitions.
- Make components modular and reusable.
- Document rationale in comments for changes.

## Specific Rules
- For bots: Use `useBots()` hook for CRUD; status enums: 'running', 'paused', 'stopped'.
- For market data: Integrate Alpaca WS and CoinGecko APIs via hooks.
- For persistence: Use Supabase tables as defined in schema.sql.
- Avoid hardcoded values; use environment variables for API keys.

## Review Checklist
- Does it follow the premise (multi-asset trading, SaaS monetization)?
- Is it responsive and accessible?
- Does it promote consistency across the codebase?
