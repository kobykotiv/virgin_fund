import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  const user_id = req.headers.get('x-user-id');
  if (!user_id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('bots')
    .select('type, risk')
    .eq('user_id', user_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const count = data.length;
  const types = [...new Set(data.map((b: any) => b.type))];
  const riskLevels = [...new Set(data.map((b: any) => b.risk))];

  return NextResponse.json({ count, types, riskLevels });
}
