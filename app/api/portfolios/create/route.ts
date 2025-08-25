import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { fetchTopCoins, fetchTopStocks, buildGridTickers } from '@/lib/market-helpers'
import { deployVirtualOrdersToAlpaca } from '@/lib/alpaca'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { preset, frequency, allocationPercent, funds, customTickers = [], deployToAlpaca } = body

  let tickers: string[] = []

  if (preset === 'top5_coins') {
    tickers = await fetchTopCoins(5)
  } else if (preset === 'top10_stocks') {
    tickers = await fetchTopStocks(10)
  } else if (preset === 'grid_1pct_coins') {
    tickers = await buildGridTickers({ percent: 1, limit: 10 })
  } else if (preset === 'custom') {
    tickers = customTickers
  }

  // Build per-ticker allocation based on allocationPercent and funds
  // allocationPercent is the % per-asset; if NA or zero, fall back to equal weight
  const perAssetPercent = allocationPercent && allocationPercent > 0 ? allocationPercent : Math.floor(100 / Math.max(1, tickers.length))
  const allocations = tickers.map((t) => ({ symbol: t, percent: perAssetPercent }))

  const portfolio = {
    tickers,
    allocations,
    funds,
    frequency,
    createdAt: new Date().toISOString(),
    preview: true,
  }

  // Optionally deploy virtual orders to Alpaca (paper trading) — helper will simulate or call API depending on config
  let alpacaResult = null
  if (deployToAlpaca) {
    try {
      alpacaResult = await deployVirtualOrdersToAlpaca(portfolio)
    } catch (e) {
      alpacaResult = { error: (e as Error).message }
    }
  }

  return NextResponse.json({ portfolio, alpacaResult })
}
