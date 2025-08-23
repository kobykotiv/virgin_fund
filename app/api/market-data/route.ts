import { NextRequest } from "next/server";
import { getPricesForSymbols as getCoinGeckoPrices } from "@/lib/market-data/providers/coingecko-provider";
import { getAlpacaPrices } from "@/lib/market-data/providers/alpaca-provider";

/**
 * API route: /api/market-data
 * Query params:
 *   symbols: comma-separated list of asset symbols (e.g. BTC,ETH,AAPL)
 *   vsCurrency: fiat currency (default: usd)
 * 
 * Returns merged price data from CoinGecko (altcoins) and Alpaca (equities/mainstream).
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbolsParam = searchParams.get("symbols");
  const vsCurrency = searchParams.get("vsCurrency") || "usd";
  if (!symbolsParam) {
    return new Response(JSON.stringify({ error: "Missing symbols param" }), { status: 400 });
  }
  const symbols = symbolsParam.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);

  // Define which symbols are altcoins (CoinGecko) vs equities (Alpaca)
  // For demo: treat BTC, ETH, LTC, DOGE, SOL, ADA as altcoins, rest as equities
  const altcoinSymbols = ["BTC", "ETH", "LTC", "DOGE", "SOL", "ADA"];
  const coingeckoSymbols = symbols.filter((s) => altcoinSymbols.includes(s));
  const alpacaSymbols = symbols.filter((s) => !altcoinSymbols.includes(s));

  // Fetch from both providers in parallel
  const [cgPrices, alpacaPrices] = await Promise.all([
    coingeckoSymbols.length ? getCoinGeckoPrices(coingeckoSymbols, vsCurrency) : Promise.resolve({}),
    alpacaSymbols.length ? getAlpacaPrices(alpacaSymbols, vsCurrency) : Promise.resolve({}),
  ]);

  // Merge results, annotate source
  const merged: Record<string, { price: number; source: string }> = {};
  for (const symbol of coingeckoSymbols) {
    if (cgPrices[symbol] !== undefined) {
      merged[symbol] = { price: cgPrices[symbol], source: "coingecko" };
    }
  }
  for (const symbol of alpacaSymbols) {
    if (alpacaPrices[symbol] !== undefined) {
      merged[symbol] = { price: alpacaPrices[symbol], source: "alpaca" };
    }
  }

  return new Response(JSON.stringify({ data: merged }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// Summary of Changes:
// - Created /api/market-data route to merge CoinGecko and Alpaca price data for requested symbols.
// - Returns { symbol: { price, source } } for each asset.
