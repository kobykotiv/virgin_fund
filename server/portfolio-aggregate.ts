/**
 * server/portfolio-aggregate.ts
 *
 * Updated portfolio aggregation service for bot-centered schema.
 * Schema: bots -> positions[] -> orders[] -> trades[]
 * - Aggregates positions across all bots for comprehensive portfolio view.
 * - Uses new schema with proper bot_id relationships.
 * - Returns enriched portfolio data with market values and P&L.
 */

import express, { Request, Response } from 'express';
import { getBots } from './bots';
import { supabase } from './supabaseClient';
import { Bot, Position, AggregatedPortfolioPosition, TableNames, PositionStatus } from '../types/database';

const router = express.Router();

/**
 * Aggregate positions across all bots using the new bot-centered schema.
 * Returns comprehensive portfolio data with market values and P&L.
 */
export async function aggregatePositionsFromBots(bots: Bot[]): Promise<AggregatedPortfolioPosition[]> {
  if (!bots || bots.length === 0) {
    return [];
  }

  const botIds = bots.map(bot => bot.id);
  
  try {
    // Query all open positions for these bots
    const { data: positions, error } = await supabase
      .from(TableNames.POSITIONS)
      .select('*')
      .in('bot_id', botIds)
      .eq('status', PositionStatus.OPEN);

    if (error || !positions) {
      console.error('Error fetching positions:', error);
      return [];
    }

    // Create a map of bot ID to bot for quick lookups
    const botMap = new Map<string, Bot>();
    bots.forEach(bot => botMap.set(bot.id, bot));

    // Map to aggregate positions by symbol
    const symbolMap = new Map<string, {
      totalShares: number;
      totalMarketValue: number;
      totalUnrealizedPnl: number;
      totalRealizedPnl: number;
      controllingBots: Map<string, { name: string; shares: number; marketValue: number }>;
      positions: Array<{
        botId: string;
        positionId: string;
        shares: number;
        avgPrice: number;
        marketValue: number;
        unrealizedPnl: number;
      }>;
    }>();

    // Process each position
    for (const position of positions) {
      const symbol = position.symbol || position.ticker || 'UNKNOWN';
      const shares = Number(position.quantity) || 0;
      const avgPrice = Number(position.avg_price) || 0;
      const marketValue = Number(position.market_value) || 0;
      const unrealizedPnl = Number(position.unrealized_pnl) || 0;
      const realizedPnl = Number(position.realized_pnl) || 0;
      
      const bot = botMap.get(position.bot_id);
      const botName = bot?.name || 'Unknown Bot';

      if (!symbolMap.has(symbol)) {
        symbolMap.set(symbol, {
          totalShares: 0,
          totalMarketValue: 0,
          totalUnrealizedPnl: 0,
          totalRealizedPnl: 0,
          controllingBots: new Map(),
          positions: []
        });
      }

      const symbolData = symbolMap.get(symbol)!;
      
      // Update totals
      symbolData.totalShares += shares;
      symbolData.totalMarketValue += marketValue;
      symbolData.totalUnrealizedPnl += unrealizedPnl;
      symbolData.totalRealizedPnl += realizedPnl;

      // Update controlling bot data
      if (symbolData.controllingBots.has(position.bot_id)) {
        const botData = symbolData.controllingBots.get(position.bot_id)!;
        botData.shares += shares;
        botData.marketValue += marketValue;
      } else {
        symbolData.controllingBots.set(position.bot_id, {
          name: botName,
          shares: shares,
          marketValue: marketValue
        });
      }

      // Add position detail
      symbolData.positions.push({
        botId: position.bot_id,
        positionId: position.id,
        shares: shares,
        avgPrice: avgPrice,
        marketValue: marketValue,
        unrealizedPnl: unrealizedPnl
      });
    }

    // Convert map to result array
    const result: AggregatedPortfolioPosition[] = [];
    
    for (const [symbol, data] of symbolMap.entries()) {
      result.push({
        symbol,
        totalShares: data.totalShares,
        totalMarketValue: data.totalMarketValue,
        totalUnrealizedPnl: data.totalUnrealizedPnl,
        totalRealizedPnl: data.totalRealizedPnl,
        controllingBots: Array.from(data.controllingBots.entries()).map(([id, botData]) => ({
          id,
          name: botData.name,
          shares: botData.shares,
          marketValue: botData.marketValue
        })),
        positions: data.positions
      });
    }

    // Sort by total market value descending
    result.sort((a, b) => b.totalMarketValue - a.totalMarketValue);

    return result;

  } catch (error) {
    console.error('Error in aggregatePositionsFromBots:', error);
    return [];
  }
}

/**
 * GET /aggregate
 * Returns aggregated positions across all bots for the current user.
 */
router.get('/aggregate', async (req: Request, res: Response) => {
  try {
    // TODO: Extract user_id from JWT token when auth is implemented
    const userId = req.headers['x-user-id'] as string;
    
    // Fetch user's bots
    const { data: bots, error: botsError } = await getBots(userId);
    
    if (botsError) {
      console.error('Error fetching bots:', botsError);
      return res.status(500).json({ 
        error: 'Failed to fetch bots', 
        details: botsError 
      });
    }

    if (!bots || bots.length === 0) {
      return res.status(200).json({ 
        aggregated: [],
        summary: {
          totalBots: 0,
          totalPositions: 0,
          totalMarketValue: 0,
          totalUnrealizedPnl: 0,
          totalRealizedPnl: 0
        }
      });
    }

    // Aggregate positions
    const aggregated = await aggregatePositionsFromBots(bots);

    // Calculate summary statistics
    const summary = {
      totalBots: bots.length,
      totalPositions: aggregated.reduce((sum, pos) => sum + pos.positions.length, 0),
      totalMarketValue: aggregated.reduce((sum, pos) => sum + pos.totalMarketValue, 0),
      totalUnrealizedPnl: aggregated.reduce((sum, pos) => sum + pos.totalUnrealizedPnl, 0),
      totalRealizedPnl: aggregated.reduce((sum, pos) => sum + pos.totalRealizedPnl, 0)
    };

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ 
      aggregated,
      summary,
      bots: bots.map(bot => ({
        id: bot.id,
        name: bot.name,
        status: bot.status,
        capital_allocated: bot.capital_allocated,
        total_pnl: bot.total_pnl,
        positions_count: bot.positions_count,
        active_orders_count: bot.active_orders_count
      }))
    });

  } catch (err: any) {
    console.error('Error in /portfolio/aggregate:', err?.message ?? err);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: err?.message || 'Unknown error'
    });
  }
});

/**
 * GET /summary
 * Returns a high-level portfolio summary across all bots.
 */
router.get('/summary', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string;

    // Use the portfolio_summary view for efficient aggregation
    const { data: summaries, error } = await supabase
      .from('portfolio_summary')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching portfolio summary:', error);
      return res.status(500).json({ error: 'Failed to fetch portfolio summary' });
    }

    // Calculate totals across all bots
    const totals = (summaries || []).reduce((acc, summary) => ({
      totalBots: acc.totalBots + 1,
      totalCapitalAllocated: acc.totalCapitalAllocated + (Number(summary.capital_allocated) || 0),
      totalPositions: acc.totalPositions + (Number(summary.total_positions) || 0),
      openPositions: acc.openPositions + (Number(summary.open_positions) || 0),
      totalMarketValue: acc.totalMarketValue + (Number(summary.total_market_value) || 0),
      totalUnrealizedPnl: acc.totalUnrealizedPnl + (Number(summary.total_unrealized_pnl) || 0),
      totalRealizedPnl: acc.totalRealizedPnl + (Number(summary.total_realized_pnl) || 0),
      totalPnl: acc.totalPnl + (Number(summary.total_pnl) || 0)
    }), {
      totalBots: 0,
      totalCapitalAllocated: 0,
      totalPositions: 0,
      openPositions: 0,
      totalMarketValue: 0,
      totalUnrealizedPnl: 0,
      totalRealizedPnl: 0,
      totalPnl: 0
    });

    res.json({
      totals,
      botSummaries: summaries || []
    });

  } catch (err: any) {
    console.error('Error in /portfolio/summary:', err?.message ?? err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
