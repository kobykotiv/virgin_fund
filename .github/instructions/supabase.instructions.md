# Supabase Connection Overview

## Purpose
Supabase is used as the backend database and authentication provider for this project. It enables real-time data, secure user management, and seamless integration with the Next.js app.

## Connection Setup
- The Supabase client is initialized in `server/supabaseClient.ts` for backend API usage.
- Environment variables required:
  - `SUPABASE_URL`: The project URL from Supabase dashboard.
  - `SUPABASE_ANON_KEY`: The public anon key for client-side access.
  - `SUPABASE_SERVICE_ROLE_KEY`: (Optional) For server-side admin operations.
- These variables must be set in `.env.local` for local development and in Vercel/production environment settings.

## Usage
- **Authentication**: Supabase Auth is used for user sign-up, login, and session management.
- **Database**: All dynamic data (portfolios, bots, KPIs, leaderboard, etc.) is stored and queried from Supabase Postgres.
- **API Routes**: Next.js API routes (in `/app/api/`) use the Supabase client to fetch and mutate data.
- **Frontend**: React Query and SWR are used to fetch data from API routes, which in turn use Supabase.

## Best Practices
- Always use environment variables for credentials.
- Use row-level security (RLS) policies in Supabase for secure data access.
- Prefer server-side API routes for sensitive operations.
- Use Supabase client only in backend or protected client components.

## Troubleshooting
- If you see connection errors, verify your environment variables and Supabase project settings.
- For permission errors, check RLS policies and service role key usage.
- Use `npx supabase start` for local development with Supabase CLI.

## References
- [Supabase Docs](https://supabase.com/docs)
- [Environment Variables in Next.js](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables)

# Supabase Local Development

Use `npx supabase start` for local development with Supabase CLI.

When running commands in the project, prefix with `npx` if you haven't globally installed the Supabase CLI:

- Start local services: `npx supabase start`
- Reset DB and run migrations: `npx supabase db reset`
- Apply migrations: `npx supabase db push`
