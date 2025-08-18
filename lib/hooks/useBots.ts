import useSWR, { mutate } from 'swr';
import { supabase } from '@/lib/supabase';

export function useBots(userId: string | null) {
  const key = userId ? ['bots', userId] : null;
  const { data, error, isLoading } = useSWR(key, async () => {
    const { data, error } = await supabase.from('bots').select('*').eq('user_id', userId);
    if (error) throw error;
    return data;
  });

  const createBot = async (bot: any) => {
    const { data, error } = await supabase.from('bots').insert(bot).select().single();
    if (error) throw error;
    mutate(key);
    return data;
  };

  const updateBot = async (id: number, updates: any) => {
    const { data, error } = await supabase.from('bots').update(updates).eq('id', id).select().single();
    if (error) throw error;
    mutate(key);
    return data;
  };

  const deleteBot = async (id: number) => {
    const { error } = await supabase.from('bots').delete().eq('id', id);
    if (error) throw error;
    mutate(key);
  };

  return { bots: data, error, isLoading, createBot, updateBot, deleteBot };
}
