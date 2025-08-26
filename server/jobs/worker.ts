import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { listBots, findBot } from '@/lib/bots-store'

// Lightweight worker to run scheduled jobs (rebalances, bot ticks).
// In staging/production this would run as a CRON Job or background worker process.

export async function runRebalanceOnce(portfolioId: string) {
  const supabase = getSupabaseAdmin()
  // Fetch portfolio and positions
  const { data: portfolio } = await supabase.from('portfolios').select('*').eq('id', portfolioId).maybeSingle()
  if (!portfolio) throw new Error('Portfolio not found')

  // For MVP run a simple rebalance: mark last_rebalanced_at and record a job row
  const { data, error } = await supabase.from('portfolio_rebalances').insert([{ portfolio_id: portfolioId, status: 'completed', executed_at: new Date().toISOString() }]).select().limit(1).maybeSingle()
  if (error) throw error
  return data
}

export async function runBotTick(botId: string) {
  // Prefer server helpers to fetch bot data so background workers share the same logic as API routes
  const bot = await findBot(botId)
  if (!bot) throw new Error('Bot not found')

  const supabase = getSupabaseAdmin()

  // Simple simulated tick: update last_run and append a log
  const { data, error } = await supabase.from('bot_runs').insert([{ bot_id: botId, status: 'ok', ran_at: new Date().toISOString() }]).select().limit(1).maybeSingle()
  if (error) throw error
  await supabase.from('bots').update({ last_run_at: new Date().toISOString() }).eq('id', botId)
  return data
}

export async function runAllActiveBots(ownerId?: string) {
  // List bots via helper so we centralize DB access and filtering
  const bots = await listBots(ownerId)
  if (!bots || !bots.length) return { processed: 0 }

  let processed = 0
  const results: Array<{ id: string; ok: boolean; error?: string }> = []
  for (const b of bots) {
    try {
      // Only tick running/enabled bots
      if ((b as any).status && (b as any).status !== 'running') {
        results.push({ id: (b as any).id, ok: false, error: 'not_running' })
        continue
      }
      await runBotTick((b as any).id)
      processed++
      results.push({ id: (b as any).id, ok: true })
    } catch (e: any) {
      results.push({ id: (b as any).id, ok: false, error: String(e) })
    }
  }

  return { processed, results }
}
