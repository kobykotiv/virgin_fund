import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

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
  const supabase = getSupabaseAdmin()
  const { data: bot } = await supabase.from('bots').select('*').eq('id', botId).maybeSingle()
  if (!bot) throw new Error('Bot not found')

  // Simple simulated tick: update last_run and append a log
  const { data, error } = await supabase.from('bot_runs').insert([{ bot_id: botId, status: 'ok', ran_at: new Date().toISOString() }]).select().limit(1).maybeSingle()
  if (error) throw error
  await supabase.from('bots').update({ last_run_at: new Date().toISOString() }).eq('id', botId)
  return data
}
