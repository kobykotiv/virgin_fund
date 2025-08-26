import { createClient } from '@supabase/supabase-js'
import fetch from 'node-fetch'

// Simple delivery function intended to run as a Supabase Edge Function or cron job.
// - Picks up undelivered notifications with method=email and attempts < max
// - Attempts delivery via an external email provider (uses a placeholder POST endpoint)
// - On success: marks notification as read (or set delivered flag)
// - On failure: increments attempts and records last_error

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

const MAX_ATTEMPTS = 5
const EMAIL_ENDPOINT = process.env.EMAIL_PROVIDER_ENDPOINT || 'https://example.com/send-email'
const EMAIL_API_KEY = process.env.EMAIL_PROVIDER_API_KEY || ''

async function fetchPending() {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('payload->>method', 'email')
    .is('payload->>delivered', null)
    .limit(50)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data ?? []
}

async function deliver(note: any) {
  const attempts = (note.payload?.attempts ?? 0) as number
  if (attempts >= MAX_ATTEMPTS) return

  const emailTo = note.payload?.email || null
  const subject = note.payload?.subject || 'Notification from Virgin Fund'
  const body = note.payload?.body || JSON.stringify(note.payload)

  try {
    const res = await fetch(EMAIL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${EMAIL_API_KEY}` },
      body: JSON.stringify({ to: emailTo, subject, body }),
    })

    if (!res.ok) throw new Error('email provider returned ' + res.status)

    // mark delivered
    await supabase.from('notifications').update({ payload: { ...note.payload, delivered: true }, read: true }).eq('id', note.id)
  } catch (e: any) {
    // increment attempts and store last_error
    const next = attempts + 1
    await supabase.from('notifications').update({ payload: { ...note.payload, attempts: next }, read: false }).eq('id', note.id)
    console.warn('Delivery failed for', note.id, e.message || e)
  }
}

export default async function handler() {
  const pending = await fetchPending()
  for (const n of pending) {
    await deliver(n)
  }

  return new Response(JSON.stringify({ processed: pending.length }), { status: 200 })
}
