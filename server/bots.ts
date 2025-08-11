
// Bot management API endpoints
import { supabase } from './supabaseClient';

export interface Bot {
  id?: string;
  name: string;
  strategy: string;
  status: string;
  [key: string]: any;
}

export async function createBot(bot: Bot) {
  const { data, error } = await supabase.from('bots').insert([bot]);
  return { data, error };
}

export async function getBots() {
  const { data, error } = await supabase.from('bots').select('*');
  return { data, error };
}

export async function updateBot(id: string, updates: Partial<Bot>) {
  const { data, error } = await supabase.from('bots').update(updates).eq('id', id);
  return { data, error };
}

export async function deleteBot(id: string) {
  const { data, error } = await supabase.from('bots').delete().eq('id', id);
  return { data, error };
}
