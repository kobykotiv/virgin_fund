import { computeSummary } from '../../scripts/process_backtests';

describe('computeSummary', () => {
  test('computes summary from equity array', () => {
    const results = [100, 110, 105, 120, 115];
    const s = computeSummary(results);
    // total_return = (115-100)/100 *100 = 15%
    expect(s.total_return).toBeCloseTo(15);
    // peak progression: 100->110->110->120->120; drawdowns: 0,0,4.545...,0,4.1666... => max ~4.545
    expect(s.max_drawdown).toBeGreaterThan(4.4);
    expect(s.max_drawdown).toBeLessThan(5);
  });

  test('computes from results object with trades', () => {
    const results = { trades: [{ pnl: 10 }, { pnl: -5 }, { pnl: 0 }, { pnl: 2 }] };
    const s = computeSummary(results);
    expect(s.win_rate).toBeCloseTo(0.5); // two positive out of four
  });
});
