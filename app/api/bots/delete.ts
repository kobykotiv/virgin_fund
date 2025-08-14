import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function DELETE(req: NextRequest) {
  const user_id = req.headers.get('x-user-id');
  const { id } = await req.json();
  if (!user_id || !id) return NextResponse.json({ error: 'Unauthorized or missing bot id' }, { status: 401 });

  const { error } = await supabase
    .from('bots')
    .delete()
    .eq('id', id)
    .eq('user_id', user_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
