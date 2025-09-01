import { NextResponse } from 'next/server'
import { getAccountForUser } from '@/lib/server/alpaca'

export async function POST(request: Request) {
  // Auth: ensure you have user context from your app. This route assumes server-session middleware or similar.
  // TODO: wire userId from session
  const userId = undefined
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const account = await getAccountForUser(userId)
    if (!account) return NextResponse.json({ error: 'Alpaca account not found for user' }, { status: 404 })

    // Create portfolio in your DB using account.cash or account.buying_power
    // TODO: implement DB persist logic here. Example response shape shown.
    const portfolio = {
      id: `portfolio_${Date.now()}`,
      name: `Alpaca Portfolio ${new Date().toISOString().slice(0,10)}`,
      initialCapital: account.cash || account.buying_power || 0,
      currency: account.currency || 'USD',
      createdAt: new Date().toISOString()
    }

    // persist portfolio to DB and return created record

    return NextResponse.json({ success: true, portfolio })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 })
  }
}
