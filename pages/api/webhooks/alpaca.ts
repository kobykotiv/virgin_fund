import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const payload = req.body;
  try {
    await supabase.from('webhook_logs').insert({ source: 'alpaca', payload, headers: req.headers });

    const clientOrderId = payload?.client_order_id || payload?.order?.client_order_id || null;
    if (clientOrderId) {
      // update matching order_records
      await supabase.from('order_records').update({ status: payload.status || payload.order?.status, meta: payload }).eq('meta->>client_order_id', clientOrderId);

      // enqueue reconciliation task (lightweight) for background worker to reconcile fills
      await supabase.from('webhook_logs').insert({ source: 'alpaca-reconcile', payload: { client_order_id: clientOrderId, body: payload }, created_at: new Date().toISOString() });
    }
    return res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error('webhook processing error', e);
    return res.status(500).json({ error: e.message || 'Internal error' });
  }
}
