import type { NextApiRequest, NextApiResponse } from 'next';
import { runBacktest } from '@/lib/backtest/engine';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = req.headers['x-user-id'] as string | undefined;
  if (!user) return res.status(401).json({ error: 'Missing user id header' });
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing id' });

  try {
    if (req.method !== 'POST') return res.status(405).end('Only POST');
    const body = req.body;
    const { symbol, start, end, initialCapital, dcaAmount, frequency } = body;
    const params = { symbol, start, end, initialCapital: Number(initialCapital) || 10000, dcaAmount: Number(dcaAmount) || 100, frequency: frequency || 'daily', slippagePct: Number(body.slippagePct) || 0, commission: Number(body.commission) || 0 };
    const resBt = await runBacktest(params);
    const { data, error } = await supabase.from('backtests').insert({ bot_id: Number(id), params: body, results: resBt, summary: resBt.summary }).select().single();
    if (error) throw error;
    return res.status(200).json({ backtest: data });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e.message || 'Internal error' });
  }
}
