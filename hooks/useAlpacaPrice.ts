import { useQuery } from "@tanstack/react-query";

/**
 * useAlpacaPrice
 * - Fetches prices for given symbols via the backend proxy (/api/market-data/alpaca)
 * - Returns { [symbol]: { price, source } }
 * - Never exposes API keys to the client
 */
export type AlpacaPrice = {
  [symbol: string]: {
    price: number;
    source: string;
  };
};

async function fetchAlpacaPrices(symbols: string[]): Promise<AlpacaPrice> {
  if (!symbols.length) return {};
  const params = new URLSearchParams({ symbols: symbols.join(",") });
  const res = await fetch(`/api/market-data/alpaca?${params.toString()}`);
  if (!res.ok) return {};
  const json = await res.json();
  // The backend returns { data: { symbol: { price, source } } }
  return json?.data ?? {};
}

export function useAlpacaPrice(symbols: string[]) {
  return useQuery({
    queryKey: ["alpaca", symbols],
    queryFn: () => fetchAlpacaPrices(symbols),
    staleTime: 5_000,
  });
}

// Summary of Changes:
// - Updated to fetch prices from /api/market-data/alpaca backend route for secure Alpaca REST proxy.
// - No longer exposes API keys or fetches directly from Alpaca on the client.
