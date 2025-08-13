# Routing Instructions

- This project uses Next.js App Router (`/app`) for all routing and page components.
- Do NOT use the legacy `/pages` directory for routing or page components.
- If a route exists in both `/pages` and `/app`, remove the `/pages` version to avoid conflicts.
- All new pages, layouts, and API routes should be created under the `/app` directory.
- Example: If both `pages/backtest.tsx` and `app/backtest/page.tsx` exist, delete `pages/backtest.tsx`.
- For dynamic routing, use `[param]` syntax in `/app`.
- For API routes, use `/app/api/route.ts` structure.
- Always prefer the App Router conventions for navigation, layouts, and data fetching.
