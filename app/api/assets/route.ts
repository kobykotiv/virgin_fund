import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Constants for popular assets
const CRYPTO_PAIRS = [
  "BTC/USD",
  "ETH/USD",
  "SOL/USD",
  "AVAX/USD",
  "MATIC/USD",
  "DOT/USD",
  "ADA/USD",
  "XRP/USD",
  "DOGE/USD",
  "LINK/USD",
];

const STOCKS = [
  "AAPL",
  "GOOGL",
  "MSFT",
  "AMZN",
  "TSLA",
  "META",
  "NVDA",
  "AMD",
  "JPM",
  "V",
];

// Fetch assets from Alpaca API
async function fetchAlpacaAssets(apiKey: string) {
  try {
    const response = await fetch('https://paper-api.alpaca.markets/v2/assets', {
      headers: {
        'APCA-API-KEY-ID': process.env.ALPACA_API_KEY_ID || '',
        'APCA-API-SECRET-KEY': process.env.ALPACA_API_SECRET_KEY || '',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from Alpaca');
    }

    const data = await response.json();
    return data
      .filter((asset: any) => asset.tradable && asset.status === 'active')
      .map((asset: any) => asset.symbol);
  } catch (error) {
    console.error('Error fetching from Alpaca:', error);
    return null;
  }
}

// Cache assets for 1 hour
let cachedAssets: string[] | null = null;
let lastCacheTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check cache
    const now = Date.now();
    if (cachedAssets && (now - lastCacheTime) < CACHE_DURATION) {
      return NextResponse.json({ assets: cachedAssets });
    }

    // Try to fetch from Alpaca
    const alpacaAssets = await fetchAlpacaAssets(process.env.ALPACA_API_KEY || '');

    if (alpacaAssets) {
      // Filter and combine assets
      const uniqueAssets = new Set([
        ...CRYPTO_PAIRS,
        ...STOCKS,
        ...alpacaAssets
      ]);

      cachedAssets = Array.from(uniqueAssets).sort();
      lastCacheTime = now;

      return NextResponse.json({ assets: cachedAssets });
    }

    // Fallback to static list if API fails
    const fallbackAssets = [...CRYPTO_PAIRS, ...STOCKS];
    
    return NextResponse.json({
      assets: fallbackAssets,
      message: "Using fallback asset list due to API unavailability"
    }, {
      status: 206 // Partial Content to indicate fallback
    });

  } catch (error) {
    console.error('Error in assets route:', error);
    return new NextResponse(
      "Internal server error",
      { status: 500 }
    );
  }
}
