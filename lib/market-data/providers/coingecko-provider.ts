// CoinGecko Market Data Provider
// Fetches altcoin/token data from CoinGecko API for use in bot dashboards and analytics.

import fetch from "node-fetch";

export interface CoinGeckoPriceResult {
  [symbol: string]: {
    usd: number;
    [currency: string]: number;
  };
}

/**
 * Fetches current prices for a list of coin IDs from CoinGecko.
 * @param ids Array of CoinGecko coin IDs (e.g. ['bitcoin', 'ethereum'])
 * @param vsCurrency The fiat currency to quote against (default: 'usd')
 */
export async function fetchCoinGeckoPrices(
  ids: string[],
  vsCurrency: string = "usd"
): Promise<CoinGeckoPriceResult> {
  if (!ids.length) return {};
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(
    ids.join(",")
  )}&vs_currencies=${encodeURIComponent(vsCurrency)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CoinGecko API error: ${res.statusText}`);
  return await res.json() as CoinGeckoPriceResult;
}

/**
 * Maps a symbol (e.g. BTC) to a CoinGecko coin ID (e.g. 'bitcoin').
 * Extend this mapping as needed for supported tokens.
 */
const symbolToId: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  LTC: "litecoin",
  DOGE: "dogecoin",
  SOL: "solana",
  ADA: "cardano",
  // Add more as needed
};

/**
 * Fetches prices for a list of symbols (e.g. ['BTC', 'ETH']) using CoinGecko.
 * Returns a mapping from symbol to price in the given currency.
 */
export async function getPricesForSymbols(
  symbols: string[],
  vsCurrency: string = "usd"
): Promise<Record<string, number>> {
  const ids = symbols
    .map((s) => symbolToId[s.toUpperCase()])
    .filter(Boolean);
  if (!ids.length) return {};
  const prices = await fetchCoinGeckoPrices(ids, vsCurrency);
  // Map back to symbol
  const result: Record<string, number> = {};
  for (const [symbol, id] of Object.entries(symbolToId)) {
    if (symbols.map((s) => s.toUpperCase()).includes(symbol) && prices[id]) {
      result[symbol] = prices[id][vsCurrency];
    }
  }
  return result;
}

// Summary of Changes:
// - Added CoinGecko provider for fetching altcoin/token prices by symbol or CoinGecko ID.
// - Provides getPricesForSymbols for dashboard integration.
