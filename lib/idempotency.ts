import { supabase } from './supabase';

export async function getIdempotencyResponse(key: string) {
  if (!key) return null;
  const { data } = await supabase.from('idempotency_keys').select('response').eq('key', key).single();
  return data?.response ?? null;
}

export async function storeIdempotencyResponse(key: string, userId: string, response: any) {
  if (!key) return null;
  await supabase.from('idempotency_keys').upsert({ key, user_id: userId, response }).select();
  return response;
}
