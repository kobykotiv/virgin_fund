import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/alpacaServer'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { decryptObject } from '@/lib/encryption'

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserFromRequest(req)
    if (!userId) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const supabase = getSupabaseAdmin()
    const { data: keyData, error } = await supabase.from('api_keys').select('encrypted_secret, metadata').eq('user_id', userId).eq('provider', 'coingecko').limit(1).maybeSingle()
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    if (!keyData) return NextResponse.json({ ok: false, error: 'No CoinGecko API key configured' }, { status: 400 })

  // Decrypt the API key (DB may store Buffers) - convert to base64 strings for decryptObject
  const encBase64 = typeof keyData.encrypted_secret === 'string' ? keyData.encrypted_secret : Buffer.from(keyData.encrypted_secret).toString('base64')
  const ivBase64 = keyData?.metadata?.encrypted_iv ? (typeof keyData.metadata.encrypted_iv === 'string' ? keyData.metadata.encrypted_iv : Buffer.from(keyData.metadata.encrypted_iv).toString('base64')) : ''
  const tagBase64 = keyData?.metadata?.encrypted_tag ? (typeof keyData.metadata.encrypted_tag === 'string' ? keyData.metadata.encrypted_tag : Buffer.from(keyData.metadata.encrypted_tag).toString('base64')) : ''

  const decrypted = await decryptObject({ encryptedBase64: encBase64, ivBase64, tagBase64 })
  const apiKey = (decrypted as any).apiKey

    // Test the API key by making a call to CoinGecko
    const testResponse = await fetch('https://api.coingecko.com/api/v3/ping', {
      headers: {
        'x-cg-demo-api-key': apiKey
      }
    })

    if (!testResponse.ok) {
      return NextResponse.json({ ok: false, error: 'Invalid API key' }, { status: 400 })
    }

    const testData = await testResponse.json()

    // Update the last_verified timestamp
    await supabase.from('api_keys').update({ updated_at: new Date().toISOString() }).eq('user_id', userId).eq('provider', 'coingecko')

    return NextResponse.json({
      ok: true,
      valid: true,
      message: testData.gecko_says || 'API key is valid'
    })
  } catch (e) {
    console.error('coingecko validate error', e)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
