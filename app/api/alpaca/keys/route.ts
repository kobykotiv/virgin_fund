import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/alpacaServer'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { encryptObject } from '@/lib/encryption'
import crypto from 'crypto'

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserFromRequest(req)
    if (!userId) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase.from('api_keys').select('id, provider, api_key_hash, is_paper, created_at, updated_at').eq('user_id', userId).eq('provider', 'alpaca').limit(1).maybeSingle()
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    if (!data) return NextResponse.json({ ok: true, configured: false })

    return NextResponse.json({
      ok: true,
      configured: true,
      id: data.id,
      is_paper: data.is_paper,
      last_verified: data.updated_at
    })
  } catch (e) {
    console.error('alpaca keys GET error', e)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserFromRequest(req)
    if (!userId) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const body = await req.json().catch(() => null)
    if (!body || !body.apiKey || !body.secretKey) return NextResponse.json({ ok: false, error: 'apiKey and secretKey required' }, { status: 400 })

    const supabase = getSupabaseAdmin()

    // Encrypt the secret key
    const secretToEncrypt = {
      secretKey: body.secretKey,
      isPaper: Boolean(body.isPaper ?? true)
    }
    const encryptedSecret = await encryptObject(secretToEncrypt)

    // Create hash of public key for lookups (not for security, just for indexing)
    const apiKeyHash = crypto.createHash('sha256').update(body.apiKey).digest('base64')

    // Upsert: delete existing alpaca keys for the user/provider and insert new
    try {
      await supabase.from('api_keys').delete().eq('user_id', userId).eq('provider', 'alpaca')
    } catch (e) {
      // ignore
    }

    const insert = {
      user_id: userId,
      name: 'Alpaca Markets API',
      provider: 'alpaca',
      api_key_hash: apiKeyHash,
      encrypted_secret: encryptedSecret.encryptedBase64,
      is_paper: Boolean(body.isPaper ?? true),
      metadata: {
        public_key_last_4: body.apiKey.slice(-4),
        encrypted_iv: encryptedSecret.ivBase64,
        encrypted_tag: encryptedSecret.tagBase64
      },
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from('api_keys').insert(insert).select('id').single()
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true, id: data.id })
  } catch (e) {
    console.error('alpaca keys POST error', e)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
