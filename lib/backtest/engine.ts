import adapter from '@/lib/alpaca';
import { Bar } from '@/lib/alpaca/adapter';

import type { BacktestParams as CanonicalBacktestParams, TradeRecord } from "@/types/backtest";

/**
 * Engine-specific backtest params (kept for backward compatibility with existing engine callers).
 * Canonical backtest types are defined in types/backtest.ts (imported above). Migrate callers to CanonicalBacktestParams when ready.
 */
export type EngineBacktestParams = {
  symbol: string;
  start: string;
  end: string;
  initialCapital: number;
  dcaAmount: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'manual';
  slippagePct?: number;
  commission?: number;
};

export async function runBacktest(params: EngineBacktestParams) {
  const bars = await adapter.getBars(params.symbol, params.start, params.end, '1Day');
  const timeseries: { timestamp: string; balance: number }[] = [];
  let cash = params.initialCapital;
  let positionQty = 0;
  let positionAvg = 0;
  const trades: any[] = [];

  for (let i = 0; i < bars.length; i++) {
    const bar = bars[i];
    // simple DCA frequency: buy every Nth bar depending on frequency
    let shouldBuy = false;
    if (params.frequency === 'daily') shouldBuy = true;
    if (params.frequency === 'weekly' && new Date(bar.t).getUTCDay() === 1) shouldBuy = true;
    if (params.frequency === 'monthly' && new Date(bar.t).getUTCDate() === 1) shouldBuy = true;

    if (shouldBuy && cash >= params.dcaAmount) {
      const price = bar.o * (1 + (params.slippagePct ?? 0) / 100);
      const qty = Math.floor(params.dcaAmount / price);
      if (qty > 0) {
        const cost = qty * price + (params.commission ?? 0);
        cash -= cost;
        positionAvg = (positionAvg * positionQty + price * qty) / (positionQty + qty || 1);
        positionQty += qty;
        trades.push({ timestamp: bar.t, type: 'buy', price, quantity: qty, value: price * qty, symbol: params.symbol } as TradeRecord);
      }
    }

    const marketValue = positionQty * bars[i].c;
    const balance = cash + marketValue;
    timeseries.push({ timestamp: bar.t, balance });
  }

  const summary = {
    initialCapital: params.initialCapital,
    finalBalance: timeseries.length ? timeseries[timeseries.length - 1].balance : params.initialCapital,
    totalReturnPct: timeseries.length ? ((timeseries[timeseries.length - 1].balance - params.initialCapital) / params.initialCapital) * 100 : 0,
    tradesCount: trades.length,
  };

  return { timeseries, trades, summary };
}
