import useSWR, { mutate } from 'swr';
import { supabase } from '@/lib/supabase';

export function useSettings(userId: string | null) {
  const key = userId ? ['settings', userId] : null;
  const { data, error, isLoading } = useSWR(key, async () => {
    const { data, error } = await supabase.from('settings').select('*').eq('user_id', userId).single();
    if (error) throw error;
    return data;
  });

  const updateSettings = async (updates: any) => {
    const { data, error } = await supabase.from('settings').upsert({ user_id: userId, ...updates }).select().single();
    if (error) throw error;
    mutate(key);
    return data;
  };

  return { settings: data, error, isLoading, updateSettings };
}
