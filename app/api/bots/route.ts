import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'cookie'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { verifySessionToken } from '@/lib/session'

export async function GET(req: NextRequest) {
  try {
    const cookies = parse(req.headers.get('cookie') || '')
    const session = await verifySessionToken(cookies['vf_session'] || '')
    if (!session || (session as any).expired) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = (session as any).user_id
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase.from('bots').select('*').eq('owner_id', userId).order('created_at', { ascending: false })
    if (error) {
      console.error('bots GET db error', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Map database fields to frontend expected fields
    const mappedData = (data || []).map((bot: any) => ({
      ...bot,
      type: bot.strategy, // Map strategy to type
      status: bot.status === 'running' ? 'active' : bot.status, // Map running to active
      createdAt: bot.created_at,
      updatedAt: bot.updated_at,
      userId: bot.owner_id
    }))

    return NextResponse.json(mappedData)
  } catch (err) {
    console.error('bots GET error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookies = parse(req.headers.get('cookie') || '')
    const session = await verifySessionToken(cookies['vf_session'] || '')
    if (!session || (session as any).expired) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = (session as any).user_id
    const supabase = getSupabaseAdmin()

    const body = (await req.json().catch(() => ({} as any))) as any
    const payload = {
      owner_id: userId,
      name: body.name || null,
      strategy: body.type || body.strategy || 'dca', // Map type to strategy
      assets: body.assets || [],
      allocation: body.allocation ?? null,
      currency: body.currency || 'USD',
      status: body.status === 'active' ? 'running' : (body.status || 'paused'), // Map active to running
      schedule_cron: body.scheduleCron || null,
      initial_balance: body.initialBalance ?? null,
    }

    const { data: inserted, error } = await supabase.from('bots').insert([payload]).select().limit(1).maybeSingle()
    if (error) {
      console.error('bots insert failed', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Map the inserted data back to frontend format
    const mappedInserted = inserted ? {
      ...inserted,
      type: inserted.strategy,
      status: inserted.status === 'running' ? 'active' : inserted.status,
      createdAt: inserted.created_at,
      updatedAt: inserted.updated_at,
      userId: inserted.owner_id
    } : null

    return NextResponse.json(mappedInserted)
  } catch (err) {
    console.error('bots POST error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
