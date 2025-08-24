import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { verifySessionToken } from '@/lib/session'

export async function DELETE(req: NextRequest) {
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

    const { data: existing, error: fetchErr } = await supabase.from('strategies').select('*').eq('id', id).maybeSingle()
    if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 500 })
    if (!existing || existing.user_id !== userId) return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 })

    const { error } = await supabase.from('strategies').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch (err:any) {
    console.error('dca delete failed', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
