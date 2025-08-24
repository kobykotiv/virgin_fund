Run-Alerts function

This Edge Function polls active alerts, evaluates simple price conditions, and creates notification records or delivers webhooks.

Usage notes:
- Intended to run on a schedule (cron) or invoked by an external scheduler.
- Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.
- Replace fetchPriceForSymbol with a real market-data integration (Alpaca / CoinGecko) and add caching/batching.
- The function inserts into `notifications` table; ensure your schema contains a notifications table with the expected columns.
