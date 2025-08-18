import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = req.headers['x-user-id'] as string | undefined;
  if (!user) return res.status(401).json({ error: 'Missing user id header' });

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('settings').select('*').eq('user_id', user).single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'PUT') {
      const updates = req.body;
      const { data, error } = await supabase.from('settings').upsert({ user_id: user, ...updates }).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    res.setHeader('Allow', ['GET', 'PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e.message || 'Internal error' });
  }
}
