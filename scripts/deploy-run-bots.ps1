# PowerShell script to deploy Supabase Edge Function run-bots
param(
  [string]$projectRef = $env:SUPABASE_PROJECT_REF
)

if (-not $projectRef) {
  Write-Error "SUPABASE_PROJECT_REF not set. Pass as -projectRef or set env var SUPABASE_PROJECT_REF."
  exit 1
}

Write-Host "Deploying run-bots function to Supabase project $projectRef"

supabase login
supabase functions deploy run-bots --project-ref $projectRef

if ($LASTEXITCODE -ne 0) {
  Write-Error "supabase functions deploy failed"
  exit $LASTEXITCODE
}

Write-Host "Deployed run-bots successfully"
