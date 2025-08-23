// Market Data page for Trading Bot Social Platform

import TickersGrid from "@/components/market/TickersGrid";

export default function MarketPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Market Data</h1>
      <div className="rounded-lg border bg-card p-6">
        <TickersGrid />
      </div>
    </div>
  );
}

// Summary of Changes:
// - Created Market Data page with placeholder for live market data and analytics.
