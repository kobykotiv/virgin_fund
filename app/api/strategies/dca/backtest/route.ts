import { NextRequest, NextResponse } from 'next/server'
import { runBacktest } from '@/lib/backtest/engine'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { verifySessionToken } from '@/lib/session'

export async function POST(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get('cookie')
    const sessionToken = cookieHeader ? cookieHeader.split(';').map(p=>p.trim()).find(p=>p.startsWith('vf_session='))?.split('=')[1] : null
    const session = await verifySessionToken(sessionToken as string)
    if (!session || (session as any).expired) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json().catch(()=>({}))
    const symbol = body.symbol || null
    const amount = body.amount || null
    const frequency = body.frequency || 'weekly'
    const start_date = body.start_date || null
    const end_date = body.end_date || null

    if (!symbol || !amount) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

    // Use engine runBacktest for DCA backtest
  const initialCapital = typeof body.initialCapital === 'number' ? body.initialCapital : Number(body.initialCapital ?? (amount ? amount * 10 : 10000))
    const params = {
      symbol,
      start: start_date || new Date(Date.now() - 1000 * 60 * 60 * 24 * 365).toISOString(),
      end: end_date || new Date().toISOString(),
      initialCapital,
      dcaAmount: amount,
      frequency: frequency as any,
    }

    const result = await runBacktest(params as any)

    return NextResponse.json({ result })
  } catch (err:any) {
    console.error('dca backtest error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
