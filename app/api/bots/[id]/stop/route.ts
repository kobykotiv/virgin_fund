import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'cookie'
import { verifySessionToken } from '@/lib/session'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookies = parse(req.headers.get('cookie') || '')
    const session = await verifySessionToken(cookies['vf_session'] || '')
    if (!session || (session as any).expired) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = (session as any).user_id
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase.from('bots').update({ status: 'stopped' }).eq('id', params.id).eq('user_id', userId).select().limit(1).maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ data: data ? { ...data, ownerId: (data as any).user_id } : null })
  } catch (err) {
    console.error('bot stop error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}