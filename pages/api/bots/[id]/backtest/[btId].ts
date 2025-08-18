import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = req.headers['x-user-id'] as string | undefined;
  if (!user) return res.status(401).json({ error: 'Missing user id header' });
  const { id, btId } = req.query;
  if (!id || !btId) return res.status(400).json({ error: 'Missing id or btId' });

  try {
    const { data, error } = await supabase.from('backtests').select('*').eq('id', Number(btId)).eq('bot_id', Number(id)).single();
    if (error) throw error;
    return res.status(200).json(data);
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e.message || 'Internal error' });
  }
}
