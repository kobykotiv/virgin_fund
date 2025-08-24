import { NextRequest, NextResponse } from 'next/server'
import { buildBasketBot } from '@/lib/bot-builder'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { verifySessionToken } from '@/lib/session'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, currency, items, totalAllocation } = body
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'invalid_items' }, { status: 400 })
    }

    // verify server-side session cookie (vf_session)
    const cookieHeader = req.headers.get('cookie') || ''
    const sessionToken = cookieHeader
      .split(';')
      .map((p) => p.trim())
      .find((p) => p.startsWith('vf_session='))
      ?.split('=')[1]

    const session = await verifySessionToken(sessionToken as string)
    if (!session || (session as any).expired) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session as any).user_id

    // Validate items: each item must have a non-empty symbol and a numeric weightPct >= 0
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'invalid_items' }, { status: 400 })
    }

    const parsedItems = items.map((it: any) => ({
      symbol: typeof it?.symbol === 'string' ? it.symbol.trim().toUpperCase() : '',
      weightPct: typeof it?.weightPct === 'number' ? it.weightPct : Number(it?.weightPct) || 0,
    }))

    // ensure symbols are non-empty and weights are non-negative
    const invalid = parsedItems.find((it) => !it.symbol || typeof it.weightPct !== 'number' || it.weightPct < 0)
    if (invalid) {
      return NextResponse.json({ error: 'invalid_item_format' }, { status: 400 })
    }

    const weightSum = parsedItems.reduce((s, it) => s + (it.weightPct || 0), 0)
    if (weightSum <= 0) {
      return NextResponse.json({ error: 'weights_must_sum_positive' }, { status: 400 })
    }

    // normalize weights to proportions (0..1)
    const normalizedItems = parsedItems.map((it) => ({ symbol: it.symbol, weight: it.weightPct / weightSum }))

    const alloc = typeof totalAllocation === 'number' && totalAllocation > 0 ? totalAllocation : Number(totalAllocation) || 1000

    // Build a preview bot for client UX (not strictly required for DB)
    const botPreview = buildBasketBot({ name, currency, items: parsedItems, totalAllocation: alloc })

    const supabase = getSupabaseAdmin()

    // Insert into `strategies` which matches supabase/schema.sql for strategy-like bots
    const strategyPayload: any = {
      user_id: userId,
      name: botPreview.name,
      type: 'basket',
      is_public: false,
      config: {
        items: normalizedItems,
        totalAllocation: alloc,
        currency: currency || botPreview.currency,
      },
      status: 'active',
    }

    const { data, error } = await supabase.from('strategies').insert([strategyPayload]).select().maybeSingle()
    if (error) {
      console.error('supabase insert strategy error', error)
      return NextResponse.json({ error: error.message || 'db_error' }, { status: 500 })
    }

    // Return both created strategy and a client-side preview for convenience
    return NextResponse.json({ data: { strategy: data, preview: botPreview } }, { status: 201 })
  } catch (e: any) {
    console.error('builder create error', e)
    return NextResponse.json({ error: e?.message || 'bad_request' }, { status: 400 })
  }
}
