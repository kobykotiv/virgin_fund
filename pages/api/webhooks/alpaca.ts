import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const payload = req.body;
  try {
    await supabase.from('webhook_logs').insert({ source: 'alpaca', payload, headers: req.headers });
    // minimal processing: if order update includes client_order_id -> find order_record and update
    const clientOrderId = payload?.client_order_id || payload?.order?.client_order_id || null;
    if (clientOrderId) {
      await supabase.from('order_records').update({ status: payload.status || payload.order?.status }).eq('meta->>client_order_id', clientOrderId);
    }
    return res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e.message || 'Internal error' });
  }
}
