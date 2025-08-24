import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { verifySessionToken } from '@/lib/session'
import { MarketDataService } from '@/services/market-data'

// Minimal execute endpoint: triggers a single DCA execution for a given strategy id
export async function POST(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get('cookie')
    const sessionToken = cookieHeader ? cookieHeader.split(';').map(p=>p.trim()).find(p=>p.startsWith('vf_session='))?.split('=')[1] : null
    const session = await verifySessionToken(sessionToken as string)
    if (!session || (session as any).expired) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = (session as any).user_id
    const body = await req.json().catch(()=>({}))
    const id = body.id
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const supabase = getSupabaseAdmin()
    const { data: strategy, error: fetchErr } = await supabase.from('strategies').select('*').eq('id', id).maybeSingle()
    if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 500 })
    if (!strategy) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (strategy.user_id !== userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

    if (strategy.type !== 'dca') return NextResponse.json({ error: 'Strategy type mismatch' }, { status: 400 })

    const config = strategy.config || {}
    const { symbol, amount } = config

    if (!symbol || !amount) return NextResponse.json({ error: 'Invalid strategy config' }, { status: 400 })

    // Fetch user's stored Alpaca API key via api_keys table or session (prefer server-side storage)
    const { data: keyRow } = await supabase.from('api_keys').select('*').eq('user_id', userId).maybeSingle()
    if (!keyRow) return NextResponse.json({ error: 'API key not configured' }, { status: 400 })

    const apiKey = keyRow.key_encrypted ? keyRow.key_encrypted : keyRow.api_key
    const secret = keyRow.secret_encrypted ? keyRow.secret_encrypted : keyRow.secret

  // MarketDataService wraps Alpaca client (paper mode by default)
  const md = new MarketDataService(apiKey, secret, true)

  // Get current snapshot and derive price
  const snapshot = await md.getSnapshot([symbol])
  // Snapshot format: { symbol: { latestTrade: { p: price }, latestQuote: {...} } }
  const s = (snapshot && snapshot[symbol]) || Object.values(snapshot || {})[0]
  const price = s?.latestTrade?.p || s?.latestQuote?.p || s?.last?.p || null
  if (!price) return NextResponse.json({ error: 'Could not fetch price' }, { status: 500 })
    const qty = amount / price

    // Place order via Alpaca
    const order = await md.placeOrder({ symbol, qty, side: 'buy', type: 'market', time_in_force: 'day' })

    // Persist order record
    await supabase.from('order_records').insert([{ bot_id: null, alpaca_order_id: order?.id || null, type: order?.type || 'market', side: 'buy', qty: qty, filled_qty: order?.filled_qty || 0, price: price, status: order?.status || null, meta: order }])

    // Update strategy last_run
    await supabase.from('strategies').update({ last_run: new Date().toISOString() }).eq('id', id)

    return NextResponse.json({ order })
  } catch (err:any) {
    console.error('dca execute error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
