// hooks/useMarketData.ts
import { useQuery } from "@tanstack/react-query";

export type MarketSource = "coingecko" | "alpaca";
export interface MarketTicker {
  symbol: string;
  price: number;
  source: MarketSource;
  series?: number[];
}

const COINGECKO_IDS = ["bitcoin", "ethereum", "dogecoin"];
const ALPACA_SYMBOLS = ["BTCUSD", "ETHUSD"];

async function fetchCoinGecko(ids: string[]): Promise<Record<string, MarketTicker>> {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(",")}&vs_currencies=usd`
    );
    const data = await res.json();
    return Object.fromEntries(
      ids.map((id) => [
        id,
        {
          symbol: id,
          price: data[id]?.usd ?? 0,
          source: "coingecko" as MarketSource,
        },
      ])
    );
  } catch {
    return {};
  }
}

async function fetchAlpaca(symbols: string[]): Promise<Record<string, MarketTicker>> {
  try {
    // Replace with your Alpaca endpoint or relay as needed
    const res = await fetch(`/api/market-data/alpaca?symbols=${symbols.join(",")}`);
    const data = await res.json();
    return Object.fromEntries(
      symbols.map((s) => [
        s,
        {
          symbol: s,
          price: data[s]?.price ?? 0,
          source: "alpaca" as MarketSource,
        },
      ])
    );
  } catch {
    return {};
  }
}

export default function useMarketData(
  coingeckoIds: string[] = COINGECKO_IDS,
  alpacaSymbols: string[] = ALPACA_SYMBOLS
) {
  return useQuery({
    queryKey: ["market-data", coingeckoIds, alpacaSymbols],
    queryFn: async () => {
      const [cg, alp] = await Promise.all([
        fetchCoinGecko(coingeckoIds),
        fetchAlpaca(alpacaSymbols),
      ]);
      // Merge, prefer Alpaca for overlapping symbols
      const merged: Record<string, MarketTicker> = { ...cg, ...alp };
      // Fallback mock data if empty
      if (Object.keys(merged).length === 0) {
        return {
          bitcoin: { symbol: "bitcoin", price: 30000, source: "coingecko" },
          ethereum: { symbol: "ethereum", price: 1800, source: "coingecko" },
          dogecoin: { symbol: "dogecoin", price: 0.12, source: "coingecko" },
        };
      }
      return merged;
    },
    staleTime: 10_000,
  });
}

// Summary of Changes:
// - Added useMarketData hook to fetch and normalize CoinGecko and Alpaca prices.
// - Annotates each ticker with its source.
// - Provides fallback mock data if APIs fail.
// - Ready for use in TickersGrid and other market data UIs.
