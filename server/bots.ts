
// Bot management API endpoints with comprehensive bot-centered schema
import { supabase } from './supabaseClient';
import { Bot, Position, Order, Trade, BotWithPositions, BotStatus, TableNames } from '../types/database';

export type CreateBotInput = Omit<Bot, 'id' | 'created_at' | 'updated_at' | 'active_orders_count' | 'positions_count'>;
export type UpdateBotInput = Partial<Omit<Bot, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

// Core bot CRUD operations
export async function createBot(botData: CreateBotInput) {
  const { data, error } = await supabase
    .from(TableNames.BOTS)
    .insert([{
      ...botData,
      status: botData.status || BotStatus.ACTIVE,
      strategy_type: botData.strategy_type || 'manual',
      risk_tolerance: botData.risk_tolerance || 'medium',
      capital_allocated: botData.capital_allocated || 0,
      max_position_size: botData.max_position_size || 0,
      auto_trade: botData.auto_trade || false,
      total_pnl: 0,
      win_rate: 0,
      active_orders_count: 0,
      positions_count: 0
    }])
    .select()
    .single();
  
  return { data, error };
}

export async function getBots(userId?: string): Promise<{ data: Bot[] | null; error: any }> {
  let query = supabase.from(TableNames.BOTS).select('*');
  
  if (userId) {
    query = query.eq('user_id', userId);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  return { data, error };
}

export async function getBot(id: string): Promise<{ data: Bot | null; error: any }> {
  const { data, error } = await supabase
    .from(TableNames.BOTS)
    .select('*')
    .eq('id', id)
    .single();
  
  return { data, error };
}

export async function getBotWithPositions(id: string): Promise<{ data: BotWithPositions | null; error: any }> {
  // Get bot with related positions, orders, and recent trades
  const { data: bot, error: botError } = await supabase
    .from(TableNames.BOTS)
    .select(`
      *,
      positions:positions!positions_bot_id_fkey (
        *,
        orders:orders!orders_position_id_fkey (*),
        trades:trades!trades_position_id_fkey (*)
      ),
      orders:orders!orders_bot_id_fkey (*),
      recent_trades:trades!trades_bot_id_fkey (*)
    `)
    .eq('id', id)
    .single();

  if (botError) {
    return { data: null, error: botError };
  }

  return { data: bot as BotWithPositions, error: null };
}

export async function updateBot(id: string, updates: UpdateBotInput) {
  const { data, error } = await supabase
    .from(TableNames.BOTS)
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  return { data, error };
}

export async function deleteBot(id: string) {
  // This will cascade delete positions, orders, and trades due to foreign key constraints
  const { data, error } = await supabase
    .from(TableNames.BOTS)
    .delete()
    .eq('id', id);
  
  return { data, error };
}

// Bot status management
export async function setBotStatus(id: string, status: Bot['status']) {
  return updateBot(id, { status });
}

export async function pauseBot(id: string) {
  return setBotStatus(id, BotStatus.PAUSED);
}

export async function activateBot(id: string) {
  return setBotStatus(id, BotStatus.ACTIVE);
}

export async function stopBot(id: string) {
  return setBotStatus(id, BotStatus.STOPPED);
}

// Bot performance and statistics
export async function updateBotPerformance(id: string, performance: number, totalPnl: number, winRate: number) {
  return updateBot(id, {
    performance,
    total_pnl: totalPnl,
    win_rate: winRate,
    last_trade_at: new Date().toISOString()
  });
}

export async function updateBotCounts(id: string) {
  // Update active_orders_count and positions_count
  const [ordersResult, positionsResult] = await Promise.all([
    supabase
      .from(TableNames.ORDERS)
      .select('id', { count: 'exact' })
      .eq('bot_id', id)
      .in('status', ['pending', 'submitted', 'partially_filled']),
    supabase
      .from(TableNames.POSITIONS)
      .select('id', { count: 'exact' })
      .eq('bot_id', id)
      .eq('status', 'open')
  ]);

  const activeOrdersCount = ordersResult.count || 0;
  const positionsCount = positionsResult.count || 0;

  return updateBot(id, {
    active_orders_count: activeOrdersCount,
    positions_count: positionsCount
  });
}

// Legacy interface for backward compatibility
export interface LegacyBot {
  id?: string;
  name: string;
  strategy: string;
  status: string;
  [key: string]: any;
}

// Legacy functions for backward compatibility (will be deprecated)
export async function createLegacyBot(bot: LegacyBot) {
  console.warn('createLegacyBot is deprecated, use createBot instead');
  const botData: CreateBotInput = {
    user_id: '', // Should be provided by caller
    name: bot.name,
    type: bot.strategy,
    risk: 'medium',
    status: bot.status as Bot['status'] || BotStatus.ACTIVE,
    strategy_type: 'manual',
    capital_allocated: 0,
    max_position_size: 0,
    risk_tolerance: 'medium',
    auto_trade: false,
    config: bot,
    performance: 0,
    total_pnl: 0,
    win_rate: 0
  };
  
  return createBot(botData);
}
