// Market Data page for Trading Bot Social Platform

export default function MarketPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Market Data</h1>
      <div className="rounded-lg border bg-card p-6">
        {/* Market Data panel: developer prompt describing required UI and data wiring */}
        <div className="text-center text-muted-foreground">
          <strong>Market Data Panel — Implementation Prompt</strong>
          <p className="mt-2">Build an interactive market overview and asset detail panel that includes:</p>
          <ul className="text-left inline-block mt-2 list-disc list-inside">
            <li>Live tickers grid (price, 24h %, 24h volume) with a data-source tag for each asset (CoinGecko or Alpaca).</li>
            <li>OHLC candlestick chart with timeframe selector (1m/5m/1h/1d) and streaming updates via Alpaca WebSocket or efficient CoinGecko polling.</li>
            <li>Order book / Level 2 view and recent trades feed where available (Alpaca for mainstream assets).</li>
            <li>Search, symbol detail panel, and quick actions: Add to watchlist, Create Bot from symbol, Backtest.</li>
            <li>Use React Query hooks (eg. <code>useCoinGeckoPrice</code>, <code>useAlpacaPrice</code>) and show clear loading/error states and fallback UIs.</li>
            <li>Charts built with Recharts; animate transitions with Framer Motion; ensure accessibility and responsive layout.</li>
          </ul>
          <p className="mt-3 text-sm">Data sources: @https://www.coingecko.com/en/api/documentation and @https://alpaca.markets/docs/api-references/market-data-api/streaming/</p>
        </div>
      </div>
    </div>
  );
}

// Summary of Changes:
// - Created Market Data page with placeholder for live market data and analytics.
