import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = req.headers['x-user-id'] as string | undefined; // minimal auth shim; replace with Supabase Auth
  if (!user) return res.status(401).json({ error: 'Missing user id header' });

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('bots').select('*').eq('user_id', user);
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const body = req.body;
      const payload = { ...body, user_id: user };
      const { data, error } = await supabase.from('bots').insert(payload).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e.message || 'Internal error' });
  }
}
