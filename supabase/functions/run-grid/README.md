Run-Grid Edge Function

This Edge Function scans bots configured with a `grid` strategy and places paper orders on Alpaca using the user's encrypted API keys stored in `api_keys`.

How it works:
- Fetch active bots where `type = 'grid'` and `enabled = true` via Supabase REST using the service role key
- For each bot, fetch a matching `api_keys` row for the same user (is_paper=true)
- Decrypt the user's secret server-side using `lib/crypto.decryptSecret`
- Fetch the latest trade price for the bot's symbol using Alpaca data API
- Apply a simple 1%-grid purchasing rule and place a market buy order for the configured `size` (notional)
- Persist an `order_records` entry via Supabase REST

Notes & TODOs:
- This is a minimal reference implementation. Replace naive grid decision logic with full position tracking, next grid level computation, and sell-side logic.
- Ensure you set environment variables for SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (service role), and SESSION_ENCRYPTION_KEY (server key for decrypt).
- This function currently assumes `api_keys.metadata.key_id` contains the Alpaca key id; adapt your key storage to include explicit `key_id` metadata when creating keys.
