"use server";

import React from "react";
import QueryProvider from "@/components/QueryProvider";
import { dehydrate, QueryClient } from "@tanstack/react-query";

// Simple server-side data fetch example to demonstrate hydration with React Query
async function fetchTickers() {
  // lightweight example: return mocked tickers; replace with real fetch to /api/market-data
  return [
    { symbol: "BTC", price: 50000 },
    { symbol: "ETH", price: 3500 },
  ];
}

export default async function Page() {
  const qc = new QueryClient();
  const tickers = await fetchTickers();
  qc.setQueryData(["tickers"], tickers);
  const dehydrated = dehydrate(qc);

  return (
    <html>
      <body>
        {/* Client component would use QueryProvider and Hydrate to read the data. This page shows an example. */}
        <QueryProvider>
          <div className="p-4">
            <h2 className="text-lg font-bold">Hydrated market data (example)</h2>
            <pre className="mt-2">{JSON.stringify(dehydrated, null, 2)}</pre>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
