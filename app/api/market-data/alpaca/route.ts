import { NextRequest } from "next/server";
import { getAlpacaPrices } from "@/lib/market-data/providers/alpaca-provider";

/**
 * API route: /api/market-data/alpaca
 * Query params:
 *   symbols: comma-separated list of asset symbols (e.g. BTCUSD,ETHUSD)
 *   vsCurrency: fiat currency (default: usd)
 * 
 * Returns price data from Alpaca for requested symbols.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbolsParam = searchParams.get("symbols");
  const vsCurrency = searchParams.get("vsCurrency") || "usd";
  if (!symbolsParam) {
    return new Response(JSON.stringify({ error: "Missing symbols param" }), { status: 400 });
  }
  const symbols = symbolsParam.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);

  try {
    const alpacaPrices = await getAlpacaPrices(symbols, vsCurrency);
    // Format: { symbol: { price, source: "alpaca" } }
    const result: Record<string, { price: number; source: string }> = {};
    for (const symbol of symbols) {
      if (alpacaPrices[symbol] !== undefined) {
        result[symbol] = { price: alpacaPrices[symbol], source: "alpaca" };
      }
    }
    return new Response(JSON.stringify({ data: result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Alpaca fetch error" }), { status: 500 });
  }
}

// Summary of Changes:
// - Added /api/market-data/alpaca route for secure Alpaca REST proxy using server-side keys.
