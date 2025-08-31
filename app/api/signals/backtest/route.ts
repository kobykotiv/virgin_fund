import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { runSimpleBacktest, runBacktestWithPrices, generatePrices } from "@/lib/simple-backtest"
import { readAlpacaKeys } from "@/lib/server-keys"

async function fetchAlpacaBars(symbol: string, timeframe = "1D", limit = 500, keyId?: string, secret?: string) {
  // Alpaca data API v2 endpoint for bars
  const base = "https://data.alpaca.markets/v2" // stocks data
  const url = `${base}/stocks/${encodeURIComponent(symbol)}/bars?timeframe=${encodeURIComponent(
    timeframe
  )}&limit=${limit}`
  const headers: Record<string, string> = {}
  if (keyId && secret) headers["APCA-API-KEY-ID"] = keyId
  if (secret) headers["APCA-API-SECRET-KEY"] = secret
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`Alpaca fetch failed ${res.status}`)
  const j = await res.json()
  // Alpaca returns bars in j.bars or j.bars array depending on endpoint
  const bars = j.bars || j
  if (!Array.isArray(bars)) throw new Error("No bars returned from Alpaca")
  // Extract close prices
  const closes: number[] = bars.map((b: any) => Number(b.c || b.close)).filter((v: number) => !Number.isNaN(v))
  return closes
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const config = body.config || { conditions: [] }
    const options = body.options || {}

    if (!Array.isArray(config.conditions)) {
      return NextResponse.json({ error: "Invalid config.conditions" }, { status: 400 })
    }

    // If requested, attempt to fetch bars from Alpaca
    if ((options.provider === "alpaca" || options.provider === "Alpaca") && (options.symbol || options.symbol === "")) {
      const symbol = options.symbol
      const timeframe = options.timeframe || "1D"
      const limit = options.lookback || 500
  const serverKeys = readAlpacaKeys()
  const keyId = options.alpacaKeyId || serverKeys?.keyId || process.env.ALPACA_KEY_ID || process.env.ALPACA_API_KEY
  const secret = options.alpacaSecret || serverKeys?.secret || process.env.ALPACA_SECRET_KEY || process.env.ALPACA_API_SECRET
      try {
        const closes = await fetchAlpacaBars(symbol, timeframe, limit, keyId, secret)
        const result = runBacktestWithPrices(config, closes, options)
        return NextResponse.json({ ok: true, result })
      } catch (err) {
        // fallback to generator
        const prices = generatePrices(options.symbol || "MOCK", options.lookback || 500)
        const result = runBacktestWithPrices(config, prices, options)
        return NextResponse.json({ ok: true, result, note: String(err) })
      }
    }

    // default local backtest
    const result = runSimpleBacktest(config, options)
    return NextResponse.json({ ok: true, result })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
