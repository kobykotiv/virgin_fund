import { NextRequest, NextResponse } from 'next/server'

const detailCache = new Map<string, { ts: number; data: any }>()
const TTL = 1000 * 60 * 5

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const cached = detailCache.get(id)
    if (cached && Date.now() - cached.ts < TTL) return NextResponse.json({ data: cached.data })

    const url = `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(id)}?localization=false&tickers=true&market_data=true&community_data=true&developer_data=true&sparkline=true`
    const res = await fetch(url)
    if (!res.ok) return NextResponse.json({ error: 'coingecko_error', status: res.status }, { status: 502 })
    const json = await res.json()

    // minimal normalized output
    const out = {
      id: json.id,
      symbol: json.symbol,
      name: json.name,
      description: json.description?.en ?? '',
      links: json.links ?? {},
      market_data: json.market_data ?? {},
      community_data: json.community_data ?? {},
      developer_data: json.developer_data ?? {},
      public_interest_score: json.public_interest_score ?? null,
      last_updated: json.last_updated,
    }
    detailCache.set(id, { ts: Date.now(), data: out })
    return NextResponse.json({ data: out })
  } catch (err: any) {
    return NextResponse.json({ error: 'proxy_error', details: err?.message ?? String(err) }, { status: 502 })
  }
}
