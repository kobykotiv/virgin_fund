param(
  [string]$supabaseProjectRef = $env:SUPABASE_PROJECT_REF,
  [string]$serviceRole = $env:SUPABASE_SERVICE_ROLE_KEY
)

if (-not $supabaseProjectRef) { Write-Error "SUPABASE_PROJECT_REF not provided"; exit 1 }
if (-not $serviceRole) { Write-Error "SUPABASE_SERVICE_ROLE_KEY not provided"; exit 1 }

Write-Host "Deploying run-bots and reconcile-order functions to Supabase project $supabaseProjectRef"

supabase functions deploy run-bots --project-ref $supabaseProjectRef --env "SUPABASE_SERVICE_ROLE_KEY=$serviceRole" --env "ALPACA_KEY=$env:ALPACA_KEY" --env "ALPACA_SECRET=$env:ALPACA_SECRET"
supabase functions deploy reconcile-order --project-ref $supabaseProjectRef --env "SUPABASE_SERVICE_ROLE_KEY=$serviceRole" --env "ALPACA_KEY=$env:ALPACA_KEY" --env "ALPACA_SECRET=$env:ALPACA_SECRET"

Write-Host "Deployed. Scheduling: create a cron job in Supabase dashboard or use GitHub Actions to call the run-bots endpoint."
