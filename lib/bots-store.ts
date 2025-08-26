import type { Bot } from '@/types/api'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

// Server-side Supabase-backed helpers for bots. These are async and
// intended for server/runtime usage (API routes, background jobs).
export async function listBots(ownerId?: string): Promise<Bot[]> {
  const supabase = getSupabaseAdmin()
  let query = supabase.from('bots').select('*').order('created_at', { ascending: false })
  if (ownerId) query = query.eq('owner_id', ownerId) as any
  const { data, error } = await query
  if (error) {
    console.error('listBots db error', error)
    return []
  }
  return (data || []) as Bot[]
}

export async function addBot(bot: Partial<Bot> & { owner_id?: string }): Promise<Bot | null> {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from('bots').insert([bot]).select().limit(1).maybeSingle()
  if (error) {
    console.error('addBot db error', error)
    return null
  }
  return data as Bot
}

export async function findBot(id: string, ownerId?: string): Promise<Bot | null> {
  const supabase = getSupabaseAdmin()
  let query = supabase.from('bots').select('*').eq('id', id).limit(1).maybeSingle()
  if (ownerId) query = supabase.from('bots').select('*').eq('id', id).eq('owner_id', ownerId).limit(1).maybeSingle() as any
  const { data, error } = await query
  if (error) {
    console.error('findBot db error', error)
    return null
  }
  return (data || null) as Bot | null
}
