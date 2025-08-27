import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/alpacaServer'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserFromRequest(req)
    if (!userId) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase.from('watchlists').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true, watchlists: data })
  } catch (e) {
    console.error('watchlists GET error', e)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserFromRequest(req)
    if (!userId) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const body = await req.json().catch(() => null)
    if (!body) return NextResponse.json({ ok: false, error: 'Request body required' }, { status: 400 })

    const { name, symbols = [], provider = 'alpaca' } = body
    if (!name) return NextResponse.json({ ok: false, error: 'name is required' }, { status: 400 })

    const supabase = getSupabaseAdmin()
    const insert = {
      user_id: userId,
      name,
      symbols,
      provider,
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabase.from('watchlists').insert(insert).select().single()
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true, watchlist: data })
  } catch (e) {
    console.error('watchlists POST error', e)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await getUserFromRequest(req)
    if (!userId) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const body = await req.json().catch(() => null)
    if (!body || !body.id) return NextResponse.json({ ok: false, error: 'id required' }, { status: 400 })

    const supabase = getSupabaseAdmin()
    const { id, ...updates } = body

    const { data, error } = await supabase.from('watchlists').update(updates).eq('id', id).eq('user_id', userId).select().single()
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true, watchlist: data })
  } catch (e) {
    console.error('watchlists PUT error', e)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await getUserFromRequest(req)
    if (!userId) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    if (!id) return NextResponse.json({ ok: false, error: 'id parameter required' }, { status: 400 })

    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from('watchlists').delete().eq('id', id).eq('user_id', userId)
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('watchlists DELETE error', e)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
