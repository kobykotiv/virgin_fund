// Supabase client setup
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// In test environments we mock createClient; guard against missing envs at import time
let supabaseClient: any
try {
	supabaseClient = createClient(supabaseUrl, supabaseKey)
} catch (err) {
	// createClient may throw if url/key are empty; provide a minimal mock for tests
	supabaseClient = {
		from: () => ({ select: async () => ({ data: [], error: null }) }),
	}
}

export const supabase = supabaseClient
