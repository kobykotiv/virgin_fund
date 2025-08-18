import useSWR, { mutate } from 'swr';
import { supabase } from '@/lib/supabase';

export function useBacktests(botId: number | null) {
  const key = botId ? ['backtests', botId] : null;
  const { data, error, isLoading } = useSWR(key, async () => {
    const { data, error } = await supabase.from('backtests').select('*').eq('bot_id', botId);
    if (error) throw error;
    return data;
  });

  const createBacktest = async (botId: number, results: object) => {
    const { data, error } = await supabase.from('backtests').insert({ bot_id: botId, results }).select().single();
    if (error) throw error;
    mutate(key);
    return data;
  };

  return { backtests: data, error, isLoading, createBacktest };
}
