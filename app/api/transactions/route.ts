import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { getUserRoleFromRequest } from '@/lib/rbac';

type Transaction = {
  id: string;
  type: string;
  amount: number;
  date: string;
  bot_id?: string | null;
  notes?: string | null;
};

/**
 * In-memory mock data used when Supabase isn't configured.
 * Keeps the API usable in local/dev without secrets.
 */
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn_demo_1',
    type: 'deposit',
    amount: 10000,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    bot_id: null,
    notes: 'Initial demo deposit',
  },
  {
    id: 'txn_demo_2',
    type: 'trade',
    amount: -250,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    bot_id: 'bot_demo_1',
    notes: 'Bought 10 shares of DEMO',
  },
];

function generateId() {
  return 'txn_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function validateTransactionPayload(payload: any) {
  if (!payload) return { valid: false, message: 'Missing payload' };
  if (!payload.type || typeof payload.type !== 'string' || payload.type.trim().length < 2) {
    return { valid: false, message: 'Transaction type is required and must be at least 2 characters.' };
  }
  if (payload.amount === undefined || payload.amount === null || isNaN(Number(payload.amount)) || Number(payload.amount) === 0) {
    return { valid: false, message: 'Amount is required and must be a non-zero number.' };
  }
  return { valid: true };
}

export async function GET(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ transactions: MOCK_TRANSACTIONS });
  }

  try {
    const { data, error } = await supabase.from('transactions').select('*');
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ transactions: data });
  } catch (err: any) {
    // If Supabase client unexpectedly fails, fall back to mock data
    return NextResponse.json({ transactions: MOCK_TRANSACTIONS });
  }
}

export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  const { userId, role } = await getUserRoleFromRequest(req, supabase);
  if (!role || !['admin', 'manager'].includes(role)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
  }
  const body = await req.json();
  const v = validateTransactionPayload(body);
  if (!v.valid) return NextResponse.json({ error: v.message }, { status: 400 });

  const record: Transaction = {
    id: generateId(),
    type: body.type,
    amount: Number(body.amount),
    date: body.date ? new Date(body.date).toISOString() : new Date().toISOString(),
    bot_id: body.bot_id ?? null,
    notes: body.notes ?? null,
  };

  if (!supabase) {
    // persist to in-memory mock
    MOCK_TRANSACTIONS.unshift(record);
    return NextResponse.json({ transaction: record }, { status: 201 });
  }

  try {
    const { data, error } = await supabase.from('transactions').insert([record]).select().maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ transaction: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  const { userId, role } = await getUserRoleFromRequest(req, supabase);
  if (!role || !['admin', 'manager'].includes(role)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
  }
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: 'Missing transaction id' }, { status: 400 });

  const v = validateTransactionPayload(body);
  if (!v.valid) return NextResponse.json({ error: v.message }, { status: 400 });

  if (!supabase) {
    const idx = MOCK_TRANSACTIONS.findIndex((t) => t.id === body.id);
    if (idx === -1) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    const updated: Transaction = {
      ...MOCK_TRANSACTIONS[idx],
      ...{
        type: body.type,
        amount: Number(body.amount),
        date: body.date ? new Date(body.date).toISOString() : MOCK_TRANSACTIONS[idx].date,
        bot_id: body.bot_id ?? MOCK_TRANSACTIONS[idx].bot_id,
        notes: body.notes ?? MOCK_TRANSACTIONS[idx].notes,
      },
    };
    MOCK_TRANSACTIONS[idx] = updated;
    return NextResponse.json({ transaction: updated });
  }

  try {
    const { data, error } = await supabase.from('transactions').update(body).eq('id', body.id).select().maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ transaction: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  const { userId, role } = await getUserRoleFromRequest(req, supabase);
  if (!role || role !== 'admin') {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
  }
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: 'Missing transaction id' }, { status: 400 });

  if (!supabase) {
    const idx = MOCK_TRANSACTIONS.findIndex((t) => t.id === body.id);
    if (idx === -1) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    MOCK_TRANSACTIONS.splice(idx, 1);
    return NextResponse.json({ success: true });
  }

  try {
    const { error } = await supabase.from('transactions').delete().eq('id', body.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 });
  }
}
