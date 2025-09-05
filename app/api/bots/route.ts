import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'cookie'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { verifySessionToken } from '@/lib/session'
import { getUserRoleFromRequest } from '@/lib/rbac'

type Bot = {
  id: string
  user_id: string
  name: string
  type: string
  strategy?: string
  status?: string
  config?: any
  capital_allocated?: number | null
  created_at?: string
  updated_at?: string
  performance?: any
}

/**
 * Lightweight in-memory mock bots used when Supabase isn't configured.
 * Allows UI to function in local/dev mode without secrets.
 */
const MOCK_BOTS: Bot[] = [
  {
    id: 'bot_demo_1',
    user_id: 'user_demo_1',
    name: 'Demo Mean Reverter',
    type: 'mean_reversion',
    strategy: 'mean_reversion',
    status: 'active',
    config: { assets: ['DEMO'], params: { lookback: 14 } },
    capital_allocated: 1000,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    performance: { totalPnL: 120.5 },
  },
  {
    id: 'bot_demo_2',
    user_id: 'user_demo_2',
    name: 'Demo Momentum',
    type: 'momentum',
    strategy: 'momentum',
    status: 'paused',
    config: { assets: ['MOCK'], params: { lookback: 7 } },
    capital_allocated: 500,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    performance: { totalPnL: -15.2 },
  },
]

function generateId() {
  return 'bot_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function mapDbBotToFrontend(bot: any) {
  return {
    ...bot,
    type: bot.type || 'manual',
    status: bot.status || 'paused',
    strategy: bot.strategy_type || bot.type || bot.strategy || 'manual',
    assets: bot.config?.assets || [],
    allocation: bot.capital_allocated ?? 0,
    createdAt: bot.created_at || bot.createdAt,
    updatedAt: bot.updated_at || bot.updatedAt,
    userId: bot.user_id || bot.userId,
    owner_id: bot.user_id || bot.owner_id || bot.userId,
  }
}

function validateBotPayload(payload: any) {
  if (!payload) return { valid: false, message: 'Missing payload' }
  if (!payload.name || typeof payload.name !== 'string' || payload.name.trim().length < 3) {
    return { valid: false, message: 'Bot name is required and must be at least 3 characters.' }
  }
  if (!payload.type || typeof payload.type !== 'string' || payload.type.trim().length < 3) {
    return { valid: false, message: 'Bot type is required and must be at least 3 characters.' }
  }
  return { valid: true }
}

export async function GET(req: NextRequest) {
  try {
    const cookies = parse(req.headers.get('cookie') || '')
    const session = await verifySessionToken(cookies['vf_session'] || '')
    if (!session || (session as any).expired) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = (session as any).user_id

    const supabase = getSupabaseAdmin()
    if (!supabase) {
      // Return mock bots for the authenticated user
      const userBots = MOCK_BOTS.filter((b) => b.user_id === userId)
      return NextResponse.json(userBots.map(mapDbBotToFrontend))
    }

    const { data, error } = await supabase
      .from('bots')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('bots GET db error', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const mappedData = (data || []).map(mapDbBotToFrontend)
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
    const { role } = await getUserRoleFromRequest(req, supabase)
    if (!role || !['admin', 'manager'].includes(role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }
    const body = (await req.json().catch(() => ({} as any))) as any

    const v = validateBotPayload(body)
    if (!v.valid) return NextResponse.json({ error: v.message }, { status: 400 })

    const payload = {
      user_id: userId,
      name: body.name || null,
      type: body.type || body.strategy || 'manual',
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
      status: body.status === 'active' ? 'active' : (body.status || 'paused'),
      strategy_type: body.type || body.strategy || 'manual',
      capital_allocated: body.allocation ?? null,
      max_position_size: body.maxPositionSize ?? null,
      risk_tolerance: body.riskTolerance || 'medium',
      auto_trade: body.autoTrade || false,
      description: body.description || null,
      performance: body.performance?.totalPnL || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (!supabase) {
      const newBot: Bot = {
        id: generateId(),
        ...payload,
      } as any
      MOCK_BOTS.unshift(newBot)
      return NextResponse.json(mapDbBotToFrontend(newBot))
    }

    const { data: inserted, error } = await supabase.from('bots').insert([payload]).select().maybeSingle()
    if (error) {
      console.error('bots insert failed', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const mappedInserted = inserted ? mapDbBotToFrontend(inserted) : null

    // Analytics: record bot created event (best-effort)
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
