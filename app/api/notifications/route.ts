import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/alpacaServer'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserFromRequest(req)
    if (!userId) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(50)
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true, notifications: data })
  } catch (e) {
    console.error('notifications GET error', e)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserFromRequest(req)
    if (!userId) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const body = await req.json().catch(() => null)
    if (!body) return NextResponse.json({ ok: false, error: 'Request body required' }, { status: 400 })

    const { alert_id, message, type = 'alert', delivery_method = 'in_app' } = body
    if (!alert_id || !message) {
      return NextResponse.json({ ok: false, error: 'alert_id and message are required' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const insert = {
      user_id: userId,
      alert_id,
      message,
      type,
      delivery_method,
      read: false,
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabase.from('notifications').insert(insert).select().single()
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })

    // If delivery method is webhook, send the webhook
    if (delivery_method === 'webhook') {
      // Get alert details for webhook payload
      const { data: alertData } = await supabase.from('alerts').select('*').eq('id', alert_id).single()
      if (alertData && alertData.delivery.webhookUrl) {
        try {
          await fetch(alertData.delivery.webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              alert: alertData,
              notification: data,
              timestamp: new Date().toISOString()
            })
          })
        } catch (webhookError) {
          console.error('Webhook delivery failed:', webhookError)
        }
      }
    }

    // If delivery method is email, we would integrate with an email service here
    // For now, we'll just log it
    if (delivery_method === 'email') {
      console.log('Email notification would be sent:', data)
    }

    return NextResponse.json({ ok: true, notification: data })
  } catch (e) {
    console.error('notifications POST error', e)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await getUserFromRequest(req)
    if (!userId) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const body = await req.json().catch(() => null)
    if (!body || !body.id) return NextResponse.json({ ok: false, error: 'id required' }, { status: 400 })

    const supabase = getSupabaseAdmin()
    const { id, ...updates } = body

    const { data, error } = await supabase.from('notifications').update(updates).eq('id', id).eq('user_id', userId).select().single()
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true, notification: data })
  } catch (e) {
    console.error('notifications PUT error', e)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
