import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest, getAlpacaCredentialsForUser } from '@/lib/alpacaServer'
import fetch from 'node-fetch'

// Simple proxy to fetch latest quote for a symbol using server-side Alpaca credentials
export async function GET(req: NextRequest, { params }: { params: { symbol?: string } }) {
  try {
    const userId = await getUserFromRequest(req)
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const creds = await getAlpacaCredentialsForUser(userId)
    if (!creds) return NextResponse.json({ error: 'No alpaca credentials' }, { status: 404 })

    const symbol = params?.symbol ?? (req.nextUrl.searchParams.get('symbol') || '')
    if (!symbol) return NextResponse.json({ error: 'Symbol required' }, { status: 400 })

    const base = creds.is_paper ? 'https://paper-api.alpaca.markets' : 'https://api.alpaca.markets'
    const url = `${base}/v2/stocks/${encodeURIComponent(symbol)}/quotes/latest`

    const res = await fetch(url, {
      headers: {
        'APCA-API-KEY-ID': creds.key,
        'APCA-API-SECRET-KEY': creds.secret,
        Accept: 'application/json',
      },
    })

    if (!res.ok) return NextResponse.json({ error: `Alpaca ${res.status}` }, { status: 502 })
    const json = await res.json()
    return NextResponse.json({ data: json })
  } catch (e) {
    console.error('alpaca quotes proxy error', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
