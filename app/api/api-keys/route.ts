import { NextRequest, NextResponse } from 'next/server'
import { serverSupabase } from '@/lib/supabaseServerClient'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.replace('Bearer ', '') || null
  const { data: userData } = await serverSupabase.auth.getUser(token as string)
  const user = userData?.user ?? null
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await serverSupabase
    .from('alpaca_keys')
    .select('api_key, is_paper')
    .eq('user_id', user.id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ key: data })
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.replace('Bearer ', '') || null
  const { data: userData } = await serverSupabase.auth.getUser(token as string)
  const user = userData?.user ?? null
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { api_key, secret_key, is_paper } = await req.json()
  if (!api_key || !secret_key) return NextResponse.json({ error: 'Missing keys' }, { status: 400 })

  // Upsert user's Alpaca keys (user_id is primary key)
  const { data, error } = await serverSupabase
    .from('alpaca_keys')
    .upsert([{ user_id: user.id, api_key, secret_key, is_paper }], { onConflict: 'user_id' })
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
