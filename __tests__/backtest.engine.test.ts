// Tests for the new modular backtest engine

import { runBacktest } from '@/lib/backtest-service';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { BotType } from '@/types/bot';

const mockBot = {
  id: 'bot1',
  name: 'Test DCA Bot',
  type: 'dca' as BotType,
  assets: ['AAPL'],
  dcaConfig: {
    amount: 100,
    interval: '* * *', // daily
  },
  status: "active",
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const mockIndicatorBot = {
  id: 'bot2',
  name: 'Test RSI Bot',
  type: 'indicator' as BotType,
  assets: ['AAPL'],
  indicatorConfig: {
    type: 'rsi',
    entryThreshold: 30,
    exitThreshold: 70,
    timeframe: "1d",
  },
  status: "active",
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const mockPrices = [
  { date: '2024-01-01', open: 100, high: 105, low: 95, close: 102, volume: 10000 },
  { date: '2024-01-02', open: 102, high: 108, low: 101, close: 107, volume: 12000 },
  { date: '2024-01-03', open: 107, high: 110, low: 106, close: 109, volume: 9000 },
];

vi.mock('@/services/market-data-service', () => ({
  fetchHistoricalData: vi.fn().mockResolvedValue(mockPrices),
}));

describe('runBacktest (modular engine)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns results for DCA bot', async () => {
    const params = {
      botId: mockBot.id,
      startDate: '2024-01-01',
      endDate: '2024-01-03',
      initialCapital: 10000,
      dataSource: "mock",
    };
    const result = await runBacktest(mockBot, params);
    expect(result.trades.length).toBeGreaterThan(0);
    expect(result.equityCurve.length).toBeGreaterThan(0);
    expect(result.finalCapital).toBeGreaterThan(0);
    expect(result.statistics.totalTrades).toBeGreaterThan(0);
  });

  it('returns results for indicator bot', async () => {
    const params = {
      botId: mockIndicatorBot.id,
      startDate: '2024-01-01',
      endDate: '2024-01-03',
      initialCapital: 10000,
      dataSource: 'mock',
    };
    const result = await runBacktest(mockIndicatorBot, params);
    expect(result.trades.length).toBeGreaterThanOrEqual(0);
    expect(result.equityCurve.length).toBeGreaterThan(0);
    expect(result.finalCapital).toBeGreaterThan(0);
  });

  it('handles empty price data gracefully', async () => {
    const fetchHistoricalData = (await import('@/services/market-data-service')).fetchHistoricalData as any;
    fetchHistoricalData.mockResolvedValueOnce([]);
    const params = {
      botId: mockBot.id,
      startDate: '2024-01-01',
      endDate: '2024-01-03',
      initialCapital: 10000,
      dataSource: 'mock',
    };
    const result = await runBacktest(mockBot, params);
    expect(result.trades.length).toBe(0);
    expect(result.equityCurve.length).toBeGreaterThanOrEqual(0);
    expect(result.finalCapital).toBeGreaterThanOrEqual(0);
  });

  it('throws or handles error from fetchHistoricalData', async () => {
    const fetchHistoricalData = (await import('@/services/market-data-service')).fetchHistoricalData as any;
    fetchHistoricalData.mockRejectedValueOnce(new Error('API error'));
    const params = {
      botId: mockBot.id,
      startDate: '2024-01-01',
      endDate: '2024-01-03',
      initialCapital: 10000,
      dataSource: "alpaca",
    };
    await expect(runBacktest(mockBot, params)).resolves.toBeDefined();
  });
});
