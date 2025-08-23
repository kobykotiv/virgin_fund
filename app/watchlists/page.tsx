// Watchlists page for Trading Bot Social Platform

export default function WatchlistsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Watchlists & Alerts</h1>
      <div className="rounded-lg border bg-card p-6">
        {/* Watchlists & Alerts — developer prompt */}
        <div className="text-center text-muted-foreground">
          <strong>Watchlists & Alerts — Implementation Prompt</strong>
          <p className="mt-2">Implement watchlist management and alerts with these features:</p>
          <ul className="text-left inline-block mt-2 list-disc list-inside">
            <li>Create and manage multiple watchlists (CoinGecko + Alpaca assets) and show live prices.</li>
            <li>Set alert thresholds (price, volume) and delivery methods (in-app, email, webhooks).</li>
            <li>Leverage Supabase realtime to persist alerts and trigger UI notifications when conditions are met.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Summary of Changes:
// - Created Watchlists page with placeholder for watchlist management and alerts.
