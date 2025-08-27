import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/alpacaServer'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { decryptObject } from '@/lib/encryption'

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserFromRequest(req)
    if (!userId) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const supabase = getSupabaseAdmin()
    const { data: keyData, error } = await supabase.from('api_keys').select('encrypted_secret, metadata').eq('user_id', userId).eq('provider', 'alpaca').limit(1).maybeSingle()
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    if (!keyData) return NextResponse.json({ ok: false, error: 'No Alpaca API key configured' }, { status: 400 })

  // Decrypt the API key (DB may store Buffers) - convert to base64 strings for decryptObject
  const encBase64 = typeof keyData.encrypted_secret === 'string' ? keyData.encrypted_secret : Buffer.from(keyData.encrypted_secret).toString('base64')
  const ivBase64 = keyData?.metadata?.encrypted_iv ? (typeof keyData.metadata.encrypted_iv === 'string' ? keyData.metadata.encrypted_iv : Buffer.from(keyData.metadata.encrypted_iv).toString('base64')) : ''
  const tagBase64 = keyData?.metadata?.encrypted_tag ? (typeof keyData.metadata.encrypted_tag === 'string' ? keyData.metadata.encrypted_tag : Buffer.from(keyData.metadata.encrypted_tag).toString('base64')) : ''

  const decrypted = await decryptObject({ encryptedBase64: encBase64, ivBase64, tagBase64 })
  const apiKey = (decrypted as any).apiKey
  const apiSecret = (decrypted as any).apiSecret

    const url = new URL(req.url)
    const symbols = url.searchParams.get('symbols')?.split(',') || []
    if (symbols.length === 0) return NextResponse.json({ ok: false, error: 'symbols parameter required' }, { status: 400 })

    // Fetch quotes from Alpaca
    const response = await fetch(`https://data.alpaca.markets/v2/stocks/quotes/latest?symbols=${symbols.join(',')}`, {
      headers: {
        'APCA-API-KEY-ID': apiKey,
        'APCA-API-SECRET-KEY': apiSecret
      }
    })

    if (!response.ok) {
      return NextResponse.json({ ok: false, error: 'Failed to fetch prices from Alpaca' }, { status: 500 })
    }

    const data = await response.json()

    // Transform response to match our format
    const prices: Record<string, any> = {}
    for (const [symbol, quoteData] of Object.entries(data.quotes || {})) {
      const q = quoteData as any
      const price = q.askprice ?? q.bidprice ?? (q.quote && (q.quote.askprice ?? q.quote.bidprice)) ?? 0
      prices[symbol] = {
        price,
        change_24h: null, // Alpaca doesn't provide 24h change in quotes
        timestamp: Date.now(),
      }
    }

    return NextResponse.json({ ok: true, prices })
  } catch (e) {
    console.error('alpaca prices error', e)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
