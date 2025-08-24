import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get('symbol')
  if (!symbol) return NextResponse.json({ error: 'missing symbol' }, { status: 400 })

  try {
    const res = await fetch(`${req.nextUrl.origin}/api/proxy/quote?symbol=${encodeURIComponent(symbol)}`)
    if (!res.ok) return NextResponse.json({ error: 'quote_error' }, { status: 502 })
    const json = await res.json()
    return NextResponse.json(json)
  } catch (e) {
    return NextResponse.json({ error: 'proxy_error' }, { status: 502 })
  }
}
