import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { decryptObject } from '@/lib/encryption'

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()

    // Get all enabled alerts
    const { data: alerts, error: alertsError } = await supabase.from('alerts').select('*').eq('enabled', true)
    if (alertsError) return NextResponse.json({ ok: false, error: alertsError.message }, { status: 500 })

    const triggeredAlerts = []

    for (const alert of alerts) {
      try {
        let currentPrice = null

        // Get API key for the provider
        const { data: keyData, error: keyError } = await supabase.from('api_keys').select('encrypted_secret, metadata').eq('user_id', alert.user_id).eq('provider', alert.provider).limit(1).maybeSingle()
        if (keyError || !keyData) continue

        // Decrypt the API key
        const decrypted = await decryptObject({
          encryptedBase64: keyData.encrypted_secret,
          ivBase64: keyData.metadata.encrypted_iv,
          tagBase64: keyData.metadata.encrypted_tag
        })

        if (alert.provider === 'alpaca') {
          const apiKey = decrypted.apiKey
          const apiSecret = decrypted.apiSecret

          // Fetch current price from Alpaca
          const response = await fetch(`https://data.alpaca.markets/v2/stocks/quotes/latest?symbols=${alert.symbol}`, {
            headers: {
              'APCA-API-KEY-ID': apiKey,
              'APCA-API-SECRET-KEY': apiSecret
            }
          })

          if (response.ok) {
            const data = await response.json()
            currentPrice = data.quotes?.[alert.symbol]?.askprice || data.quotes?.[alert.symbol]?.bidprice
          }
        } else if (alert.provider === 'coingecko') {
          const apiKey = decrypted.apiKey

          // Map symbol to CoinGecko ID (simplified)
          const symbolToId: Record<string, string> = {
            'BTC': 'bitcoin',
            'ETH': 'ethereum',
            'ADA': 'cardano',
            'SOL': 'solana',
            'DOT': 'polkadot',
            'LINK': 'chainlink',
            'UNI': 'uniswap',
            'AAVE': 'aave',
            'SUSHI': 'sushi',
            'COMP': 'compound-governance-token',
            'MKR': 'maker',
            'YFI': 'yearn-finance',
            'BAL': 'balancer',
            'CRV': 'curve-dao-token',
            'REN': 'ren',
            'BAT': 'basic-attention-token',
            'OMG': 'omisego',
            'LRC': 'loopring',
            'REP': 'augur',
            'GNT': 'golem',
            'STORJ': 'storj',
            'ANT': 'aragon',
            'MLN': 'melon',
            'FUN': 'funfair',
            'WAVES': 'waves',
            'LSK': 'lisk',
            'ARK': 'ark',
            'STRAT': 'stratis',
            'XEM': 'nem',
            'QTUM': 'qtum',
            'BTG': 'bitcoin-gold',
            'ZRX': '0x',
            'REPv2': 'augur',
            'LPT': 'livepeer',
            'NMR': 'numeraire'
          }

          const coinId = symbolToId[alert.symbol.toUpperCase()]
          if (coinId) {
            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`, {
              headers: {
                'x-cg-demo-api-key': apiKey
              }
            })

            if (response.ok) {
              const data = await response.json()
              currentPrice = data[coinId]?.usd
            }
          }
        }

        if (currentPrice === null) continue

        // Check if alert condition is met
        let conditionMet = false
        switch (alert.condition) {
          case 'above':
            conditionMet = currentPrice > alert.threshold
            break
          case 'below':
            conditionMet = currentPrice < alert.threshold
            break
          case 'equals':
            conditionMet = Math.abs(currentPrice - alert.threshold) < 0.01
            break
          case 'crosses_above':
            // For simplicity, treat as above for now
            conditionMet = currentPrice > alert.threshold
            break
          case 'crosses_below':
            // For simplicity, treat as below for now
            conditionMet = currentPrice < alert.threshold
            break
        }

        if (conditionMet) {
          // Create notification
          const message = `${alert.symbol} ${alert.condition} ${alert.threshold} - Current: $${currentPrice.toFixed(2)}`

          const notificationInsert = {
            user_id: alert.user_id,
            alert_id: alert.id,
            message,
            type: 'alert',
            delivery_method: alert.delivery.in_app ? 'in_app' : (alert.delivery.email ? 'email' : 'webhook'),
            read: false,
            created_at: new Date().toISOString()
          }

          const { data: notification, error: notificationError } = await supabase.from('notifications').insert(notificationInsert).select().single()
          if (!notificationError && notification) {
            triggeredAlerts.push({ alert, notification, currentPrice })

            // Send webhook if configured
            if (alert.delivery.webhookUrl) {
              try {
                await fetch(alert.delivery.webhookUrl, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    alert,
                    notification,
                    currentPrice,
                    timestamp: new Date().toISOString()
                  })
                })
              } catch (webhookError) {
                console.error('Webhook delivery failed:', webhookError)
              }
            }
          }
        }
      } catch (alertError) {
        console.error(`Error processing alert ${alert.id}:`, alertError)
      }
    }

    return NextResponse.json({
      ok: true,
      triggeredCount: triggeredAlerts.length,
      triggeredAlerts
    })
  } catch (e) {
    console.error('alert trigger error', e)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
