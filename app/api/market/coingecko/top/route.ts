import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory cache keyed by request URL
const cache = new Map<string, { ts: number; data: any }>()
const TTL = 1000 * 60 * 2 // 2 minutes

function getCached(key: string) {
  const e = cache.get(key)
  if (!e) return null
  if (Date.now() - e.ts > TTL) {
    cache.delete(key)
    return null
  }
  return e.data
}

function setCached(key: string, data: any) {
  cache.set(key, { ts: Date.now(), data })
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const per_page = Math.min(250, Number(url.searchParams.get('per_page') ?? '100'))
    const vs_currency = url.searchParams.get('vs_currency') ?? 'usd'

    const cacheKey = `top:${vs_currency}:${page}:${per_page}`
    const cached = getCached(cacheKey)
    if (cached) return NextResponse.json({ data: cached })

    const cg = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${encodeURIComponent(vs_currency)}&order=market_cap_desc&per_page=${per_page}&page=${page}&sparkline=true&price_change_percentage=24h`;
    const res = await fetch(cg, { headers: { 'Accept': 'application/json' } })
    if (!res.ok) return NextResponse.json({ error: 'coingecko_error', status: res.status }, { status: 502 })
    const json = await res.json()
    // normalize a few fields to be safe
    const out = (json || []).map((c: any) => ({
      id: c.id,
      symbol: c.symbol,
      name: c.name,
      image: c.image,
      current_price: c.current_price,
      market_cap: c.market_cap,
      market_cap_rank: c.market_cap_rank,
      total_volume: c.total_volume,
      price_change_percentage_24h: c.price_change_percentage_24h,
      sparkline_in_7d: c.sparkline_in_7d,
    }))
    setCached(cacheKey, out)
    return NextResponse.json({ data: out })
  } catch (err: any) {
    return NextResponse.json({ error: 'proxy_error', details: err?.message ?? String(err) }, { status: 502 })
  }
}
