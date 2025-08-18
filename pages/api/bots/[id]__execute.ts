import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import adapter from '@/lib/alpaca';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = req.headers['x-user-id'] as string | undefined;
  if (!user) return res.status(401).json({ error: 'Missing user id header' });
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing id' });

  try {
    if (req.method !== 'POST') return res.status(405).end('Only POST');
    const idempotency = req.headers['x-idempotency-key'] as string | undefined;
    if (!idempotency) return res.status(400).json({ error: 'Missing X-Idempotency-Key header' });

    const { data: bot, error: bErr } = await supabase.from('bots').select('*').eq('id', Number(id)).eq('user_id', user).single();
    if (bErr) throw bErr;
    if (!bot) return res.status(404).json({ error: 'Bot not found' });

    // Simple execute: place order for symbol=bot.name (for MVP) using dca_amount as notional
    const symbol = bot.name.split(' ')[0] || 'AAPL';
    const notional = Number(bot.dca_amount);
    const result = await adapter.placeOrder({ symbol, side: 'buy', notional, client_order_id: idempotency });

    // store order record
    await supabase.from('order_records').insert({ bot_id: bot.id, alpaca_order_id: result.id, type: result.raw?.type ?? 'market', side: result.side, qty: result.qty, filled_qty: result.filled_qty, price: result.price, status: result.status, meta: result.raw });

    return res.status(200).json({ result });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e.message || 'Internal error' });
  }
}
