import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest, getAlpacaCredentialsForUser } from '@/lib/alpacaServer'

// Server-Sent Events proxy that polls Alpaca latest quote for a symbol and streams updates to the client.
export async function GET(req: NextRequest) {
  try {
    const userId = await getUserFromRequest(req)
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const creds = await getAlpacaCredentialsForUser(userId)
    if (!creds) return NextResponse.json({ error: 'No alpaca credentials' }, { status: 404 })

    const url = req.nextUrl
    const symbol = url.searchParams.get('symbol') || url.searchParams.get('q') || ''
    if (!symbol) return NextResponse.json({ error: 'symbol query param required' }, { status: 400 })

    const base = creds.is_paper ? 'https://paper-api.alpaca.markets' : 'https://api.alpaca.markets'
    const quotePath = `/v2/stocks/${encodeURIComponent(symbol)}/quotes/latest`

    const stream = new ReadableStream({
      start(controller) {
        let closed = false

        async function poll() {
          if (closed) return
          try {
            const res = await fetch(base + quotePath, {
              headers: {
                'APCA-API-KEY-ID': creds.key,
                'APCA-API-SECRET-KEY': creds.secret,
                Accept: 'application/json',
              },
            })
            if (res.ok) {
              const json = await res.json().catch(() => null)
              const payload = { ok: true, timestamp: new Date().toISOString(), symbol, data: json }
              const encoded = `data: ${JSON.stringify(payload)}\n\n`
              controller.enqueue(new TextEncoder().encode(encoded))
            } else {
              const payload = { ok: false, error: `alpaca ${res.status}` }
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(payload)}\n\n`))
            }
          } catch (e) {
            controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ ok: false, error: String(e) })}\n\n`))
          }

          // schedule next poll
          if (!closed) setTimeout(poll, 1000)
        }

        poll()

        return () => {
          closed = true
          try { controller.close() } catch (e) {}
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    })
  } catch (e) {
    console.error('alpaca stream error', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
