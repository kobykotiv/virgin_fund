import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { encryptSecret, hashApiKey } from '@/lib/crypto'
import { verifySessionToken } from '@/lib/session'

function parseCookie(header: string | null) {
  if (!header) return {}
  return Object.fromEntries(
    header
      .split(';')
      .map((p) => p.trim())
      .map((p) => {
        const idx = p.indexOf('=')
        if (idx === -1) return [p, '']
        return [p.slice(0, idx), decodeURIComponent(p.slice(idx + 1))]
      })
  )
}

export async function GET(req: NextRequest) {
  try {
    const cookies = parseCookie(req.headers.get('cookie'))
    const sessionToken = cookies['vf_session'] || cookies['SESSION'] || null
    const session = await verifySessionToken(sessionToken as string)
    if (!session || (session as any).expired) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseAdmin()
    const userId = (session as any).user_id

    const { data, error } = await supabase
      .from('api_keys')
      .select('id, name, provider, is_paper, is_active, metadata, created_at, updated_at, api_key_hash')
      .eq('user_id', userId)

    if (error) {
      console.error('alpaca/keys GET db error', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Indicate configured status for the AlpacaKeyForm convenience
    const configured = (data || []).some((k: any) => k.provider === 'alpaca' && k.is_active)
    return NextResponse.json({ keys: data || [], configured })
  } catch (e) {
    console.error('alpaca/keys GET error', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookies = parseCookie(req.headers.get('cookie'))
    const sessionToken = cookies['vf_session'] || cookies['SESSION'] || null
    const session = await verifySessionToken(sessionToken as string)
    if (!session || (session as any).expired) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json().catch(() => ({} as any))) as any
    const apiKey = typeof body.apiKey === 'string' ? body.apiKey.trim() : ''
    const secretKey = typeof body.secretKey === 'string' ? body.secretKey.trim() : ''
    const isPaper = typeof body.isPaper === 'boolean' ? body.isPaper : true

    if (!apiKey || !secretKey) {
      return NextResponse.json({ error: 'Missing apiKey or secretKey' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const userId = (session as any).user_id

    const api_key_hash = hashApiKey(apiKey)
    const encrypted_secret = encryptSecret(secretKey)

    const { data: existing, error: fetchErr } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', 'alpaca')
      .limit(1)
      .maybeSingle()

    if (fetchErr) {
      console.warn('alpaca/keys lookup failed', fetchErr)
      return NextResponse.json({ error: 'Failed to check existing keys' }, { status: 500 })
    }

    const payload = {
      user_id: userId,
      name: 'Alpaca',
      provider: 'alpaca',
      api_key_hash,
      encrypted_secret,
      is_paper: isPaper,
      is_active: true,
      metadata: {},
    }

    if (existing) {
      const { data: updated, error: updateErr } = await supabase
        .from('api_keys')
        .update(payload)
        .eq('id', existing.id)
        .select()
        .limit(1)
        .maybeSingle()

      if (updateErr) {
        console.error('alpaca/keys update failed', updateErr)
        return NextResponse.json({ error: updateErr.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, key: updated })
    }

    const { data: inserted, error: insertErr } = await supabase.from('api_keys').insert([payload]).select().limit(1).maybeSingle()
    if (insertErr) {
      console.error('alpaca/keys insert failed', insertErr)
      return NextResponse.json({ error: insertErr.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, key: inserted })
  } catch (err) {
    console.error('alpaca/keys POST error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const cookies = parseCookie(req.headers.get('cookie'))
    const sessionToken = cookies['vf_session'] || cookies['SESSION'] || null
    const session = await verifySessionToken(sessionToken as string)
    if (!session || (session as any).expired) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseAdmin()
    const userId = (session as any).user_id

    const { error } = await supabase.from('api_keys').update({ is_active: false }).eq('user_id', userId).eq('provider', 'alpaca')
    if (error) {
      console.error('alpaca/keys DELETE failed', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('alpaca/keys DELETE error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
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
