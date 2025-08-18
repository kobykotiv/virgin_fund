import { runBacktest } from '@/lib/backtest/engine';

test('backtest runs and returns timeseries', async () => {
  const res = await runBacktest({ symbol: 'AAPL', start: '2024-01-01', end: '2024-01-10', initialCapital: 10000, dcaAmount: 100, frequency: 'daily' });
  expect(res.timeseries.length).toBeGreaterThan(0);
  expect(res.summary).toHaveProperty('finalBalance');
});
