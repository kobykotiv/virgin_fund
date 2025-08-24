import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { verifySessionToken } from '@/lib/session'

export async function POST(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get('cookie')
    const sessionToken = cookieHeader ? cookieHeader.split(';').map(p=>p.trim()).find(p=>p.startsWith('vf_session='))?.split('=')[1] : null
    const session = await verifySessionToken(sessionToken as string)
    if (!session || (session as any).expired) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = (session as any).user_id
    const body = await req.json().catch(()=>({}))

    // Basic validation
    const name = typeof body.name === 'string' && body.name.trim() ? body.name.trim() : null
    const symbol = typeof body.symbol === 'string' && body.symbol.trim() ? body.symbol.trim() : null
    const amount = typeof body.amount === 'number' ? body.amount : Number(body.amount) || null
    const frequency = typeof body.frequency === 'string' ? body.frequency : null
    const start_date = body.start_date || null
    const end_date = body.end_date || null

    if (!name || !symbol || !amount || !frequency) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const config = { symbol, amount, frequency, start_date, end_date }

    const { data, error } = await supabase
      .from('strategies')
      .insert([{ user_id: userId, name, type: 'dca', config }])
      .select()
      .maybeSingle()

    if (error) {
      console.error('create dca strategy error', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ strategy: data })
  } catch (err:any) {
    console.error('dca create error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
