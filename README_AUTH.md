Auth and RLS setup (summary)

1. Create the users table and policies
   - Run the SQL migration: `supabase db query < supabase/migrations/001_create_users_and_policies.sql`

2. Seed initial roles/users
   - Run: `supabase db query < supabase/seed/seed_roles.sql`

3. Environment variables
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - JWT_SECRET

4. Backend helpers
   - `lib/supabaseAdmin.ts` is provided for server-side queries using the service role.
   - `lib/session.ts` provides `createSessionToken` and `verifySessionToken` (JWT helpers)

5. API Endpoints
   - `app/api/users/route.ts` - GET / PATCH for user profile. Uses `verifySessionToken`.
   - `app/api/bots/*` already use `verifySessionToken`.

Notes
- Policies use `auth.uid()` and `auth.role()` which require Supabase Edge Functions or Postgres RLS with JWT auth configured.
- For local development, use the Supabase CLI and set `SUPABASE_SERVICE_ROLE_KEY` in your environment.
