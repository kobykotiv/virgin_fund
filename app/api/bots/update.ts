import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function PUT(req: NextRequest) {
  const user_id = req.headers.get('x-user-id');
  const { id, ...fields } = await req.json();
  if (!user_id || !id) return NextResponse.json({ error: 'Unauthorized or missing bot id' }, { status: 401 });

  const { data, error } = await supabase
    .from('bots')
    .update(fields)
    .eq('id', id)
    .eq('user_id', user_id)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ bot: data ? data[0] : null });
}
