import { NextResponse } from 'next/server'
import { serverSupabase } from '@/lib/supabaseServerClient'
import fetch from 'node-fetch'

export async function POST() {
  // Evaluate active alerts, insert notifications (for Supabase realtime) and attempt webhook delivery if configured.
  try {
    const { data: alerts, error } = await serverSupabase.from('alerts').select('*').eq('is_active', true)
    if (error) throw error
    if (!alerts || alerts.length === 0) return NextResponse.json({ checked: 0 })

    let created = 0
    for (const al of alerts) {
      try {
        const cond = al.condition || {}
        const sym = cond.symbol
        if (!sym) continue

        // fetch current price from a suitable source
        let price: number | null = null
        if (/^[A-Z]{1,5}$/.test(sym)) {
          const res = await fetch(`https://query2.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(sym)}`)
          const j: any = await res.json().catch(() => ({}))
          price = Number(j?.quoteResponse?.result?.[0]?.regularMarketPrice ?? null)
        } else {
          const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(sym)}&vs_currencies=usd`)
          const j: any = await res.json().catch(() => ({}))
          price = Number(j?.[sym]?.usd ?? null)
        }
        if (price == null || Number.isNaN(price)) continue

        const op = (cond.op as string) || '<='
        const target = Number(cond.price)
        let triggered = false
        if (op === '<=' && price <= target) triggered = true
        if (op === '>=' && price >= target) triggered = true

        if (triggered) {
          // build a notification payload compatible with the notifications table
          const notif = {
            alert_id: al.id,
            user_id: al.user_id,
            payload: {
              symbol: sym,
              op,
              target,
              price,
              alertName: al.name ?? null,
            },
          }

          await serverSupabase.from('notifications').insert([notif])
          created++

          // update alert metadata: last_triggered_at and optionally deactivate if one-time
          const oneTime = al.payload?.one_time === true || al.payload?.one_time === 'true'
          await serverSupabase.from('alerts').update({ last_triggered_at: new Date().toISOString(), is_active: oneTime ? false : al.is_active }).eq('id', al.id)

          // Delivery: attempt webhook POST for webhook alerts. For email, we persist the notification and rely on a worker to send email.
          if (al.method === 'webhook') {
            const webhookUrl = al.payload?.webhook_url || al.payload?.url
            if (webhookUrl) {
              try {
                await fetch(webhookUrl, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(notif.payload) })
              } catch (e) {
                // ignore delivery errors; notification record still created
              }
            }
          }
        }
      } catch (e) {
        // continue on per-alert errors
        continue
      }
    }

    return NextResponse.json({ checked: alerts.length, created })
  } catch (e) {
    return NextResponse.json({ error: 'failed', details: String(e) }, { status: 500 })
  }
}
