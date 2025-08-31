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
  const supabase = getSupabaseAdmin() as any

    const { data, error } = await supabase.from('bots').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    if (error) {
      console.error('bots GET db error', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Map database fields to frontend expected fields
    const mappedData = (data || []).map((bot: any) => ({
      ...bot,
      type: bot.type || 'manual', // Map type to type
      status: bot.status || 'paused', // Map status to status
      strategy: bot.strategy_type || bot.type || 'manual', // Map strategy_type to strategy
      assets: bot.config?.assets || [], // Extract assets from config
      allocation: bot.capital_allocated || 0, // Map capital_allocated to allocation
      createdAt: bot.created_at,
      updatedAt: bot.updated_at,
      userId: bot.user_id,
      owner_id: bot.user_id // Add owner_id for compatibility
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
      user_id: userId,
      name: body.name || null,
      type: body.type || body.strategy || 'manual', // Map type to type
      risk: body.risk || 'medium',
      config: {
        assets: body.assets || [],
        stopLoss: body.stopLoss,
        takeProfit: body.takeProfit,
        maxDrawdown: body.maxDrawdown,
        indicatorConfig: body.indicatorConfig,
        gridConfig: body.gridConfig,
        dcaConfig: body.dcaConfig,
        basketConfig: body.basketConfig,
      },
      status: body.status === 'active' ? 'active' : (body.status || 'paused'), // Map active to active
      strategy_type: body.type || body.strategy || 'manual',
      capital_allocated: body.allocation ?? null,
      max_position_size: body.maxPositionSize ?? null,
      risk_tolerance: body.riskTolerance || 'medium',
      auto_trade: body.autoTrade || false,
      description: body.description || null,
      performance: body.performance?.totalPnL || 0
    }

    const { data: inserted, error } = await supabase.from('bots').insert([payload]).select().limit(1).maybeSingle()
    if (error) {
      console.error('bots insert failed', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Map the inserted data back to frontend format
    const mappedInserted = inserted ? {
      ...inserted,
      type: inserted.type || 'manual',
      status: inserted.status || 'paused',
      strategy: inserted.strategy_type || inserted.type || 'manual',
      assets: inserted.config?.assets || [],
      allocation: inserted.capital_allocated || 0,
      createdAt: inserted.created_at,
      updatedAt: inserted.updated_at,
      userId: inserted.user_id,
      owner_id: inserted.user_id // Add owner_id for compatibility
    } : null

    // Analytics: record bot created event
    try {
      await supabase.from('analytics_events').insert([{ user_id: userId, event_type: 'bot.created', payload: { bot_id: mappedInserted?.id } }])
    } catch (ae) {
      console.warn('analytics insert failed', ae)
    }

    return NextResponse.json(mappedInserted)
  } catch (err) {
    console.error('bots POST error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
