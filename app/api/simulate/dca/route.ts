import { NextRequest, NextResponse } from 'next/server'
import { expandCron } from '@/lib/cron-utils'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { symbol, scheduleCron, amountPerRun, count = 5 } = body
    if (!symbol || !scheduleCron) return NextResponse.json({ error: 'missing params' }, { status: 400 })

    // Expand cron into timestamps (ISO)
    let timestamps: string[]
    try {
      timestamps = await expandCron(scheduleCron, count)
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 })
    }

    // For each timestamp, fetch the current quote as a simple proxy for price.
    // In a real system you'd fetch historical price for that timestamp.
    const fills: Array<{ ts: string; price: number; amount: number; qty: number }> = []
    for (const ts of timestamps) {
      try {
        const res = await fetch(`${req.nextUrl.origin}/api/market/quote?symbol=${encodeURIComponent(symbol)}`)
        const json = await res.json().catch(() => ({}))
        const price = Number(json?.price ?? json?.last_price ?? json?.close ?? 0) || 0
        const qty = amountPerRun && price > 0 ? Number((amountPerRun / price).toFixed(8)) : 0
        fills.push({ ts, price, amount: amountPerRun, qty })
      } catch (e) {
        fills.push({ ts, price: 0, amount: amountPerRun, qty: 0 } as any)
      }
    }

    return NextResponse.json({ schedulePreview: timestamps, simulatedFills: fills })
  } catch (e) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  }
}
