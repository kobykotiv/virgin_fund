import { createClient } from '@supabase/supabase-js';
import { Pool } from 'pg';

const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const DATABASE_URL = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
}
if (!DATABASE_URL) {
  throw new Error('Missing TEST_DATABASE_URL or DATABASE_URL for SELECT ... FOR UPDATE SKIP LOCKED');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });
const pool = new Pool({ connectionString: DATABASE_URL });

export type BacktestSummary = {
  total_return: number; // percent
  max_drawdown: number; // percent
  win_rate: number; // 0..1
  trades?: number;
  note?: string;
};

export function computeSummary(resultsRaw: any): BacktestSummary {
  let results = resultsRaw;
  if (!results) return { total_return: 0, max_drawdown: 0, win_rate: 0 };
  if (typeof results === 'string') {
    try { results = JSON.parse(results); } catch (e) { /* keep as-is */ }
  }

  // Try common shapes: results.equity_curve (array of { t, value }), results.equity (array), results.equity_series
  let equity: number[] | undefined;
  if (Array.isArray(results)) {
    // maybe array of numbers
    if (results.length && typeof results[0] === 'number') equity = results as number[];
  }
  if (!equity && Array.isArray(results.equity)) equity = results.equity.map((v: any) => Number(v));
  if (!equity && Array.isArray(results.equity_series)) equity = results.equity_series.map((v: any) => Number(v));
  if (!equity && Array.isArray(results.equity_curve)) equity = results.equity_curve.map((p: any) => Number(p.value ?? p.equity ?? p));

  // Trades shape
  const trades = Array.isArray(results.trades) ? results.trades : undefined;

  // Compute total_return
  let total_return = 0;
  if (equity && equity.length >= 2) {
    const first = equity[0];
    const last = equity[equity.length - 1];
    if (first !== 0) total_return = ((last - first) / Math.abs(first)) * 100;
  } else if (results.total_return !== undefined) {
    total_return = Number(results.total_return);
  }

  // Compute max_drawdown
  let max_drawdown = 0;
  if (equity && equity.length > 0) {
    let peak = equity[0];
    for (const v of equity) {
      if (v > peak) peak = v;
      const dd = peak === 0 ? 0 : ((peak - v) / Math.abs(peak)) * 100;
      if (dd > max_drawdown) max_drawdown = dd;
    }
  } else if (results.max_drawdown !== undefined) {
    max_drawdown = Number(results.max_drawdown);
  }

  // Compute win_rate
  let win_rate = 0;
  if (trades && trades.length > 0) {
    const winners = trades.filter((t: any) => Number(t.pnl ?? t.profit ?? t.return ?? 0) > 0).length;
    win_rate = winners / trades.length;
  } else if (Array.isArray(results.returns)) {
    const positives = results.returns.filter((r: any) => Number(r) > 0).length;
    win_rate = positives / results.returns.length;
  } else if (results.win_rate !== undefined) {
    win_rate = Number(results.win_rate);
  }

  const summary: BacktestSummary = {
    total_return: Number(total_return.toFixed(6)),
    max_drawdown: Number(max_drawdown.toFixed(6)),
    win_rate: Number(Number(win_rate).toFixed(6)),
    trades: trades ? trades.length : undefined,
  };

  return summary;
}

export async function run(options?: { batchSize?: number }) {
  const batchSize = options?.batchSize ?? 20;

  // Use a Postgres client and FOR UPDATE SKIP LOCKED to claim rows safely
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Select backtests without summary, lock them for processing
    const selectSql = `SELECT id, results FROM backtests WHERE summary IS NULL ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT $1`;
    const res = await client.query(selectSql, [batchSize]);
    const rows = res.rows;
    if (!rows || rows.length === 0) {
      await client.query('COMMIT');
      console.log('No pending backtests to process');
      return;
    }

    for (const row of rows) {
      const id = row.id;
      try {
        // Compute summary locally
        const summary = computeSummary(row.results);
        // Use supabase client to update summary (or use client.query to update directly)
        const { error: updErr } = await supabase.from('backtests').update({ summary }).eq('id', id);
        if (updErr) {
          console.error('Failed to update backtest summary for', id, updErr);
          // continue to next
          continue;
        }
        console.log(`Processed backtest ${id}`);
      } catch (e) {
        console.error('Error processing backtest', id, e);
      }
    }

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Error in backtest run transaction', e);
  } finally {
    client.release();
  }
}

// If executed directly, run once
if (require.main === module) {
  run().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
}
