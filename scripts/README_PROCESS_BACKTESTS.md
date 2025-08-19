Processing backtests

This script processes new backtests and writes a summary JSON into `backtests.summary`.

Files
- `scripts/process_backtests.ts` - Node/TS script that computes summary metrics and updates `backtests.summary`.

Environment
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` must be set in the environment.

Run once (PowerShell):

```powershell
$env:SUPABASE_URL = "https://your.supabase.url"
$env:SUPABASE_SERVICE_ROLE_KEY = "<service-role-key>"
node -r ts-node/register scripts/process_backtests.ts
```

Run as cron (example, hourly):

```
0 * * * * /usr/bin/env node /path/to/repo/scripts/process_backtests.js
```

Notes
- The script uses `idempotency_keys` to avoid double-processing. If you prefer row-locking use a transaction with `SELECT ... FOR UPDATE SKIP LOCKED` on a proper SQL client.
- Adjust batch size in `run({ batchSize: 50 })` if you have many backtests.
