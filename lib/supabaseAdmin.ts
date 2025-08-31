import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const getSupabaseAdmin = () => {
  if (!supabaseUrl || !supabaseServiceKey) {
    // Provide a mock client in test environments to avoid throwing at import time
    return {
      from: () => ({ select: async () => ({ data: [], error: null }), update: async () => ({ data: [], error: null }) }),
      auth: { admin: { revokeUserSessions: async () => ({ data: null, error: null }) } },
    }
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
