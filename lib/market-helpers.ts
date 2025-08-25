// Lightweight market helpers (placeholders) — in production replace with real data sources
export async function fetchTopCoins(limit = 5): Promise<string[]> {
  // For now return common top coins; replace with a real CoinGecko call in future
  const common = ['BTCUSD', 'ETHUSD', 'USDTUSD', 'BNBUSD', 'XRPUSD', 'ADAUSD', 'SOLUSD']
  return common.slice(0, limit)
}

export async function fetchTopStocks(limit = 10): Promise<string[]> {
  // Placeholder list — in production call a market-cap provider
  const stocks = ['AAPL', 'MSFT', 'AMZN', 'GOOG', 'NVDA', 'TSLA', 'META', 'BRK.B', 'JNJ', 'V']
  return stocks.slice(0, limit)
}

export function buildGridTickers(opts: { percent: number; limit?: number }) {
  // For grid portfolios we return top N coins (placeholder)
  const { percent, limit = 10 } = opts
  return fetchTopCoins(limit)
}
