import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { getUserFromAuthHeader } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserFromAuthHeader(req);
  if (!user || !user.id) return res.status(401).json({ error: 'Unauthorized' });
  const userId = user.id as string;
  const confirmation = req.headers['x-confirmation-token'] as string | undefined;

  try {
    const { data: settings } = await supabase.from('settings').select('*').eq('user_id', userId).single();
    if (!settings || !settings.developer_mode) return res.status(403).json({ error: 'Developer mode required' });
    if (confirmation !== 'dev-only-unsafe') return res.status(400).json({ error: 'Missing or invalid confirmation token' });

    // fetch non-liquidated bots
    const { data: bots } = await supabase.from('bots').select('*').eq('user_id', userId).eq('liquidated', false);
    for (const b of bots || []) {
      // mark liquidated and write a log
      await supabase.from('bots').update({ liquidated: true }).eq('id', b.id);
      await supabase.from('liquidations').insert({ user_id: userId, reason: 'global_liquidation' });
    }

    return res.status(200).json({ ok: true, count: (bots || []).length });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e.message || 'Internal error' });
  }
}
