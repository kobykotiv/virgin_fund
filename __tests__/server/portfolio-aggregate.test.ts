/**
 * __tests__/server/portfolio-aggregate.test.ts
 *
 * Unit tests for the refactored bot-centered portfolio aggregation.
 * Tests the aggregatePositionsFromBots function with the new schema structure.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Bot, BotStatus } from '../../types/database';

// Set environment variables before any imports
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock.key.for.testing';

// Create a complete mock of the server/supabaseClient module
vi.mock('../../server/supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        in: vi.fn(() => ({
          eq: vi.fn(() => ({
            data: [],
            error: null
          }))
        }))
      }))
    }))
  }
}));

import { aggregatePositionsFromBots } from '../../server/portfolio-aggregate';

describe('aggregatePositionsFromBots - new bot-centered schema', () => {
  let mockSupabase: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Get the mocked supabase instance
    const supabaseModule = await import('../../server/supabaseClient');
    mockSupabase = supabaseModule.supabase;
    
    // Reset the mock to default behavior (empty data, no error)
    vi.mocked(mockSupabase.from).mockReturnValue({
      select: vi.fn(() => ({
        in: vi.fn(() => ({
          eq: vi.fn(() => ({
            data: [],
            error: null
          }))
        }))
      }))
    });
  });

  it('returns empty array when no bots provided', async () => {
    const result = await aggregatePositionsFromBots([]);
    expect(result).toEqual([]);
  });

  it('returns empty array when bots have no positions in database', async () => {
    const bots: Bot[] = [
      {
        id: 'bot1',
        user_id: 'user1',
        name: 'Test Bot 1',
        type: 'manual',
        risk: 'medium',
        status: BotStatus.ACTIVE,
        strategy_type: 'manual',
        capital_allocated: 10000,
        max_position_size: 1000,
        risk_tolerance: 'medium',
        auto_trade: false,
        config: {},
        performance: 0,
        total_pnl: 0,
        win_rate: 0,
        active_orders_count: 0,
        positions_count: 0,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ];

    const result = await aggregatePositionsFromBots(bots);
    expect(result).toEqual([]);
  });

  it('handles supabase errors gracefully', async () => {
    // Mock supabase to return an error
    vi.mocked(mockSupabase.from).mockReturnValue({
      select: vi.fn(() => ({
        in: vi.fn(() => ({
          eq: vi.fn(() => ({
            data: null,
            error: { message: 'Database error' }
          }))
        }))
      }))
    } as any);

    const bots: Bot[] = [
      {
        id: 'bot1',
        user_id: 'user1',
        name: 'Test Bot 1',
        type: 'manual',
        risk: 'medium',
        status: BotStatus.ACTIVE,
        strategy_type: 'manual',
        capital_allocated: 10000,
        max_position_size: 1000,
        risk_tolerance: 'medium',
        auto_trade: false,
        config: {},
        performance: 0,
        total_pnl: 0,
        win_rate: 0,
        active_orders_count: 0,
        positions_count: 0,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ];

    const result = await aggregatePositionsFromBots(bots);
    expect(result).toEqual([]);
  });

  it('aggregates positions correctly when supabase returns data', async () => {
    // Mock supabase to return position data
    const mockPositions = [
      {
        id: 'pos1',
        bot_id: 'bot1',
        symbol: 'AAPL',
        quantity: 100,
        avg_price: 150.00,
        market_value: 17500.00,
        unrealized_pnl: 2500.00,
        realized_pnl: 500.00
      },
      {
        id: 'pos2',
        bot_id: 'bot2',
        symbol: 'AAPL',
        quantity: 50,
        avg_price: 160.00,
        market_value: 8750.00,
        unrealized_pnl: 750.00,
        realized_pnl: 250.00
      },
      {
        id: 'pos3',
        bot_id: 'bot1',
        symbol: 'TSLA',
        quantity: 25,
        avg_price: 200.00,
        market_value: 5250.00,
        unrealized_pnl: 250.00,
        realized_pnl: 100.00
      }
    ];

    vi.mocked(mockSupabase.from).mockReturnValue({
      select: vi.fn(() => ({
        in: vi.fn(() => ({
          eq: vi.fn(() => ({
            data: mockPositions,
            error: null
          }))
        }))
      }))
    } as any);

    const bots: Bot[] = [
      {
        id: 'bot1',
        user_id: 'user1',
        name: 'Growth Bot',
        type: 'algorithmic',
        risk: 'high',
        status: BotStatus.ACTIVE,
        strategy_type: 'algorithmic',
        capital_allocated: 25000,
        max_position_size: 5000,
        risk_tolerance: 'high',
        auto_trade: true,
        config: {},
        performance: 10.5,
        total_pnl: 2850,
        win_rate: 0.75,
        active_orders_count: 2,
        positions_count: 2,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'bot2',
        user_id: 'user1',
        name: 'Value Bot',
        type: 'manual',
        risk: 'medium',
        status: BotStatus.ACTIVE,
        strategy_type: 'manual',
        capital_allocated: 15000,
        max_position_size: 2000,
        risk_tolerance: 'medium',
        auto_trade: false,
        config: {},
        performance: 5.2,
        total_pnl: 1000,
        win_rate: 0.65,
        active_orders_count: 0,
        positions_count: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ];

    const result = await aggregatePositionsFromBots(bots);

    expect(result).toHaveLength(2);
    
    // Check AAPL aggregation (should be first due to higher market value)
    const aaplPosition = result.find(p => p.symbol === 'AAPL');
    expect(aaplPosition).toBeDefined();
    expect(aaplPosition!.totalShares).toBe(150);
    expect(aaplPosition!.totalMarketValue).toBe(26250.00);
    expect(aaplPosition!.totalUnrealizedPnl).toBe(3250.00);
    expect(aaplPosition!.totalRealizedPnl).toBe(750.00);
    expect(aaplPosition!.controllingBots).toHaveLength(2);
    expect(aaplPosition!.positions).toHaveLength(2);

    // Check TSLA aggregation
    const tslaPosition = result.find(p => p.symbol === 'TSLA');
    expect(tslaPosition).toBeDefined();
    expect(tslaPosition!.totalShares).toBe(25);
    expect(tslaPosition!.totalMarketValue).toBe(5250.00);
    expect(tslaPosition!.controllingBots).toHaveLength(1);
    expect(tslaPosition!.controllingBots[0].name).toBe('Growth Bot');
    expect(tslaPosition!.positions).toHaveLength(1);

    // Verify sorting by market value (AAPL should be first)
    expect(result[0].symbol).toBe('AAPL');
    expect(result[1].symbol).toBe('TSLA');
  });

  it('handles missing or invalid position data gracefully', async () => {
    // Mock supabase to return positions with missing/invalid data
    const mockPositions = [
      {
        id: 'pos1',
        bot_id: 'bot1',
        symbol: 'AAPL',
        quantity: null, // Invalid quantity
        avg_price: 150.00,
        market_value: null, // Invalid market value
        unrealized_pnl: 'invalid', // Invalid P&L
        realized_pnl: 500.00
      },
      {
        id: 'pos2',
        bot_id: 'bot2',
        symbol: '', // Empty symbol
        quantity: 50,
        avg_price: 160.00,
        market_value: 8000.00,
        unrealized_pnl: 500.00,
        realized_pnl: 250.00
      }
    ];

    vi.mocked(mockSupabase.from).mockReturnValue({
      select: vi.fn(() => ({
        in: vi.fn(() => ({
          eq: vi.fn(() => ({
            data: mockPositions,
            error: null
          }))
        }))
      }))
    } as any);

    const bots: Bot[] = [
      {
        id: 'bot1',
        user_id: 'user1',
        name: 'Test Bot 1',
        type: 'manual',
        risk: 'medium',
        status: BotStatus.ACTIVE,
        strategy_type: 'manual',
        capital_allocated: 10000,
        max_position_size: 1000,
        risk_tolerance: 'medium',
        auto_trade: false,
        config: {},
        performance: 0,
        total_pnl: 0,
        win_rate: 0,
        active_orders_count: 0,
        positions_count: 0,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ];

    const result = await aggregatePositionsFromBots(bots);

    // Should handle invalid data gracefully and still return results for valid positions
    expect(result).toHaveLength(2); // AAPL and empty symbol (treated as 'UNKNOWN')
    
    const aaplPosition = result.find(p => p.symbol === 'AAPL');
    expect(aaplPosition).toBeDefined();
    expect(aaplPosition!.totalShares).toBe(0); // null quantity becomes 0
    expect(aaplPosition!.totalMarketValue).toBe(0); // null market_value becomes 0
  });
});
