import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = req.headers['x-user-id'] as string | undefined;
  if (!user) return res.status(401).json({ error: 'Missing user id header' });
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing id' });

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('bots').select('*').eq('user_id', user).eq('id', Number(id)).single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'PUT') {
      const updates = req.body;
      const { data, error } = await supabase.from('bots').update(updates).eq('id', Number(id)).eq('user_id', user).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const { error } = await supabase.from('bots').delete().eq('id', Number(id)).eq('user_id', user);
      if (error) throw error;
      return res.status(204).end();
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e.message || 'Internal error' });
  }
}
