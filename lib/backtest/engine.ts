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
  // Strategy selection & config (optional). Examples: { name: 'dca' }, { name: 'market', amount }, { name: 'grid', gridSize }
  strategy?: string;
  strategyConfig?: Record<string, any>;
  // Allow shorting / leverage (simple simulation)
  allowShort?: boolean;
  leverage?: number; // 1 = cash only, >1 uses margin buying power
};

export async function runBacktest(params: EngineBacktestParams) {
  const bars = await adapter.getBars(params.symbol, params.start, params.end, '1Day');

  // State
  const timeseries: { timestamp: string; balance: number; cash: number; positions: { symbol: string; qty: number; avgPrice: number; marketPrice: number; marketValue: number }[] }[] = [];
  let cash = params.initialCapital;
  let positionQty = 0; // positive = long, negative = short
  let positionAvg = 0;
  const trades: any[] = [];

  const commission = params.commission ?? 0;
  const slippagePct = params.slippagePct ?? 0;
  const allowShort = !!params.allowShort;
  const leverage = Math.max(1, params.leverage ?? 1);

  // Helper to execute trades (market executed at price)
  function executeTrade(type: 'buy' | 'sell' | 'short' | 'cover', price: number, qty: number, ts: string) {
    const slippageMultiplier = 1 + (slippagePct / 100) * (type === 'buy' || type === 'cover' ? 1 : -1);
    const execPrice = price * slippageMultiplier;
    const value = execPrice * qty;
    // commission applied per trade
    if (type === 'buy' || type === 'cover') {
      // buying decreases cash
      cash -= value + commission;
      positionAvg = (positionAvg * positionQty + execPrice * qty) / (positionQty + qty || 1);
      positionQty += qty;
    } else if (type === 'sell') {
      // selling decreases position, increases cash
      const sellQty = Math.min(qty, Math.max(0, positionQty));
      cash += sellQty * execPrice - commission;
      positionQty -= sellQty;
      if (positionQty === 0) positionAvg = 0;
    } else if (type === 'short') {
      if (!allowShort) return;
      // short selling: create negative position, cash increases by proceeds
      cash += value - commission;
      // average price for short (store as positive avg for reference)
      positionAvg = (positionAvg * Math.abs(positionQty) + execPrice * qty) / (Math.abs(positionQty) + qty || 1);
      positionQty -= qty; // more negative
    }

    trades.push({ timestamp: ts, type, price: execPrice, quantity: qty, value, symbol: params.symbol, commission });
  }

  // Strategy helpers
  const strategy = (params.strategy ?? 'dca').toLowerCase();
  const cfg = params.strategyConfig ?? {};

  // For GRID strategy, precompute grid levels
  let gridLevels: number[] = [];
  if (strategy === 'grid') {
    const gridSize = cfg.gridSize ?? 1; // percent
    const levels = cfg.levels ?? 5;
    // Build symmetric grid around first bar close
    const base = bars[0]?.c ?? 0;
    for (let i = 1; i <= levels; i++) {
      gridLevels.push(base * (1 - (gridSize / 100) * i));
      gridLevels.push(base * (1 + (gridSize / 100) * i));
    }
    gridLevels = gridLevels.sort((a, b) => a - b);
  }

  // buying power when using leverage
  const buyingPower = () => params.initialCapital * leverage + cash - params.initialCapital;

  for (let i = 0; i < bars.length; i++) {
    const bar = bars[i];
    const ts = bar.t;

    // Decide actions based on strategy
    if (strategy === 'dca') {
      let shouldBuy = false;
      if (params.frequency === 'daily') shouldBuy = true;
      if (params.frequency === 'weekly' && new Date(bar.t).getUTCDay() === 1) shouldBuy = true;
      if (params.frequency === 'monthly' && new Date(bar.t).getUTCDate() === 1) shouldBuy = true;

      if (shouldBuy) {
        const amount = params.dcaAmount ?? cfg.amount ?? 0;
        const available = cash + Math.max(0, buyingPower());
        const price = bar.o * (1 + slippagePct / 100);
        const qty = Math.floor(amount / price);
        if (qty > 0 && available >= qty * price + commission) {
          executeTrade('buy', price, qty, ts);
        }
      }
    } else if (strategy === 'market') {
      // one-time market buy at first bar
      if (i === 0) {
        const amount = cfg.amount ?? params.dcaAmount ?? params.initialCapital;
        const price = bar.o * (1 + slippagePct / 100);
        const qty = Math.floor(amount / price);
        if (qty > 0) executeTrade('buy', price, qty, ts);
      }
    } else if (strategy === 'grid') {
      // simple grid: buy when price falls below a level, sell when above
      for (const level of gridLevels) {
  if (bar.l <= level && cash >= (cfg.unitAmount ?? params.dcaAmount)) {
          // buy a unit
          const price = level * (1 + slippagePct / 100);
          const qty = Math.floor((cfg.unitAmount ?? params.dcaAmount) / price);
          if (qty > 0) executeTrade('buy', price, qty, ts);
        }
        if (bar.h >= level && positionQty > 0) {
          // sell a unit
          const price = level * (1 - slippagePct / 100);
          const qty = Math.min(positionQty, Math.floor((cfg.unitAmount ?? params.dcaAmount) / price));
          if (qty > 0) executeTrade('sell', price, qty, ts);
        }
      }
    } else if (strategy === 'short') {
      // simple short: open short at first bar for amount
      if (i === 0 && allowShort) {
        const amount = cfg.amount ?? params.dcaAmount ?? params.initialCapital;
        const price = bar.o * (1 - slippagePct / 100);
        const qty = Math.floor(amount / price);
        if (qty > 0) executeTrade('short', price, qty, ts);
      }
    }

    // compute market value and balance
    const marketPrice = bar.c;
    const marketValue = positionQty * marketPrice;
    const balance = cash + marketValue;

    timeseries.push({
      timestamp: ts,
      balance,
      cash,
      positions: [
        {
          symbol: params.symbol,
          qty: positionQty,
          avgPrice: positionAvg,
          marketPrice,
          marketValue,
        },
      ],
    });
  }

  const final = timeseries.length ? timeseries[timeseries.length - 1] : null;
  const summary = {
    initialCapital: params.initialCapital,
    finalBalance: final?.balance ?? params.initialCapital,
    totalReturnPct: final ? ((final.balance - params.initialCapital) / params.initialCapital) * 100 : 0,
    tradesCount: trades.length,
  };

  return { timeseries, trades, summary };
}
