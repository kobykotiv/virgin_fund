import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { getUserFromAuthHeader } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserFromAuthHeader(req);
  if (!user || !user.id) return res.status(401).json({ error: 'Unauthorized' });
  const userId = user.id as string;

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('bots').select('*').eq('user_id', userId);
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const body = req.body;
      const payload = { ...body, user_id: userId };
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
