import { supabase } from '@/lib/supabase-client';
import { getRandomCurrency, getRandomBalance, getMockPositions, getMockTrades, getMockBots, getMockStrategies } from './demo-portfolio-utils';

/**
 * Generates and seeds demo portfolio and related data for a given user ID.
 * @param userId Supabase user ID
 */
export async function generateDemoPortfolio(userId: string) {
  const currency = getRandomCurrency();
  const balance = await getRandomBalance(currency);
  const positions = getMockPositions(currency);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  // Create demo_portfolio
  const { data: portfolio, error: portfolioError } = await supabase
    .from('demo_portfolios')
    .insert([
      {
        user_id: userId,
        currency,
        balance,
        positions,
        expires_at: expiresAt,
      },
    ])
    .select()
    .single();
  if (portfolioError || !portfolio) throw new Error('Failed to create demo portfolio');

  // Seed trades, bots, strategies
  const trades = getMockTrades(portfolio.id, currency);
  const bots = getMockBots(portfolio.id);
  const strategies = getMockStrategies(portfolio.id, bots);

  await Promise.all([
    supabase.from('demo_trades').insert(trades),
    supabase.from('demo_bots').insert(bots),
    supabase.from('demo_strategies').insert(strategies),
  ]);
}
