import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/alpacaServer'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { decryptObject } from '@/lib/encryption'

export async function GET(req: NextRequest) {
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

    const url = new URL(req.url)
    const symbols = url.searchParams.get('symbols')?.split(',') || []
    if (symbols.length === 0) return NextResponse.json({ ok: false, error: 'symbols parameter required' }, { status: 400 })

    // Map symbols to CoinGecko IDs (simplified mapping)
    const symbolToId: Record<string, string> = {
      BTC: 'bitcoin',
      ETH: 'ethereum',
      ADA: 'cardano',
      SOL: 'solana',
      DOT: 'polkadot',
      LINK: 'chainlink',
      UNI: 'uniswap',
      AAVE: 'aave',
      SUSHI: 'sushi',
      COMP: 'compound-governance-token',
      MKR: 'maker',
      YFI: 'yearn-finance',
      BAL: 'balancer',
      CRV: 'curve-dao-token',
      REN: 'ren',
      BAT: 'basic-attention-token',
      OMG: 'omisego',
      LRC: 'loopring',
      REP: 'augur',
      GNT: 'golem',
      STORJ: 'storj',
      ANT: 'aragon',
      MLN: 'melon',
      FUN: 'funfair',
      WAVES: 'waves',
      LSK: 'lisk',
      ARK: 'ark',
      STRAT: 'stratis',
      XEM: 'nem',
      QTUM: 'qtum',
      BTG: 'bitcoin-gold',
      ZRX: '0x',
      REPv2: 'augur',
      LPT: 'livepeer',
      NMR: 'numeraire',
    }

    const ids = symbols.map(s => symbolToId[s.toUpperCase()]).filter(Boolean)
    if (ids.length === 0) return NextResponse.json({ ok: false, error: 'No valid symbols provided' }, { status: 400 })

    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=usd&include_24hr_change=true`, {
      headers: {
        'x-cg-demo-api-key': apiKey
      }
    })

    if (!response.ok) {
      return NextResponse.json({ ok: false, error: 'Failed to fetch prices from CoinGecko' }, { status: 500 })
    }

    const data = await response.json()

    // Transform response to match our format
    const prices: Record<string, any> = {}
    for (const [id, priceDataRaw] of Object.entries(data)) {
      const priceData = priceDataRaw as any
      const symbol = Object.keys(symbolToId).find((s) => symbolToId[s] === id)
      if (symbol) {
        prices[symbol] = {
          price: priceData?.usd ?? 0,
          change_24h: priceData?.usd_24h_change ?? 0,
          timestamp: Date.now(),
        }
      }
    }

    return NextResponse.json({ ok: true, prices })
  } catch (e) {
    console.error('coingecko prices error', e)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
