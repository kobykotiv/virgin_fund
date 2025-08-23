import { useQuery } from "@tanstack/react-query";

type CoinGeckoPrice = {
  [id: string]: {
    usd: number;
    usd_24h_change?: number;
    usd_24h_vol?: number;
  };
};

async function fetchCoinGeckoPrices(ids: string[]): Promise<CoinGeckoPrice> {
  if (!ids || ids.length === 0) return {};
  const q = ids.join(",");
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(
    q
  )}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`);
  const data = await res.json();
  return data as CoinGeckoPrice;
}

export function useCoinGeckoPrice(ids: string[]) {
  return useQuery({
    queryKey: ["coingecko", ids],
    queryFn: () => fetchCoinGeckoPrices(ids),
    staleTime: 10_000,
    refetchInterval: 10_000,
  });
}

export type { CoinGeckoPrice };
