Deliver Notifications function

Purpose
- Periodically deliver queued notifications (email) recorded in the `notifications` table.
- Records delivery attempts in the notification payload and marks delivered/read on success.

Environment variables required
- SUPABASE_URL - your Supabase project URL (e.g. https://xyz.supabase.co)
- SUPABASE_SERVICE_ROLE_KEY - service role key used by server-side functions
- EMAIL_PROVIDER_ENDPOINT - HTTP endpoint to send email delivery requests (or leave blank to use placeholder)
- EMAIL_PROVIDER_API_KEY - API key for your email provider

Deploying
1. Install the Supabase CLI and authenticate: https://supabase.com/docs/guides/cli
2. From repo root run:

  npx supabase functions deploy deliver-notifications --project-ref <your-project-ref>

3. Set environment variables for the function in the Supabase dashboard or via CLI:

  npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY="<your-service-role-key>" EMAIL_PROVIDER_API_KEY="<key>" --project-ref <your-project-ref>

Testing locally
- The function expects Node-like globals and `fetch`. Use the Supabase local runner or a lightweight Node script to call the function entry point for testing.

Local run (recommended)
- Create a `.env` file from `.env.example` in `supabase/functions/deliver-notifications/` and fill the vars.
- Run the function locally with the Supabase CLI (this will load the env file into the function runtime):

  npx supabase functions serve deliver-notifications --env-file supabase/functions/deliver-notifications/.env

This runs a local HTTP server exposing the function. Use curl or a browser to POST to the function endpoint shown in the CLI output.

Notes
- Replace the placeholder POST to EMAIL_PROVIDER_ENDPOINT with a provider SDK (SendGrid, SES, Postmark) for production reliability.
- Consider adding exponential backoff and a delayed retry queue for transient failures.
