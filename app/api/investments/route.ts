import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { getUserRoleFromRequest } from '@/lib/rbac';

type Investment = {
  id: string;
  amount: number;
  fund_id?: string | null;
  investor_id?: string | null;
  date: string;
  notes?: string | null;
  status?: string | null;
};

/**
 * In-memory mock investments used when Supabase isn't configured.
 * Keeps the API usable in local/dev without secrets.
 */
const MOCK_INVESTMENTS: Investment[] = [
  {
    id: 'inv_demo_1',
    amount: 5000,
    fund_id: 'fund_demo_1',
    investor_id: 'user_demo_1',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    notes: 'Seed investment for demo fund',
    status: 'active',
  },
  {
    id: 'inv_demo_2',
    amount: 2500,
    fund_id: 'fund_demo_2',
    investor_id: 'user_demo_2',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    notes: 'Follow-up investment',
    status: 'pending',
  },
];

function generateId() {
  return 'inv_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function validateInvestmentPayload(payload: any) {
  if (!payload) return { valid: false, message: 'Missing payload' };
  if (payload.amount === undefined || payload.amount === null || isNaN(Number(payload.amount)) || Number(payload.amount) <= 0) {
    return { valid: false, message: 'Amount is required and must be a positive number.' };
  }
  return { valid: true };
}

export async function GET(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ investments: MOCK_INVESTMENTS });
  }

  try {
    const { data, error } = await supabase.from('investments').select('*');
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ investments: data });
  } catch (err: any) {
    return NextResponse.json({ investments: MOCK_INVESTMENTS });
  }
}

export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  const { userId, role } = await getUserRoleFromRequest(req, supabase);
  if (!role || !['admin', 'manager'].includes(role)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
  }
  const body = await req.json();
  const v = validateInvestmentPayload(body);
  if (!v.valid) return NextResponse.json({ error: v.message }, { status: 400 });

  const record: Investment = {
    id: generateId(),
    amount: Number(body.amount),
    fund_id: body.fund_id ?? null,
    investor_id: body.investor_id ?? null,
    date: body.date ? new Date(body.date).toISOString() : new Date().toISOString(),
    notes: body.notes ?? null,
    status: body.status ?? 'active',
  };

  if (!supabase) {
    MOCK_INVESTMENTS.unshift(record);
    return NextResponse.json({ investment: record }, { status: 201 });
  }

  try {
    const { data, error } = await supabase.from('investments').insert([record]).select().maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ investment: data }, { status: 201 });
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
  if (!body.id) return NextResponse.json({ error: 'Missing investment id' }, { status: 400 });

  const v = validateInvestmentPayload(body);
  if (!v.valid) return NextResponse.json({ error: v.message }, { status: 400 });

  if (!supabase) {
    const idx = MOCK_INVESTMENTS.findIndex((i) => i.id === body.id);
    if (idx === -1) return NextResponse.json({ error: 'Investment not found' }, { status: 404 });
    const updated: Investment = {
      ...MOCK_INVESTMENTS[idx],
      ...{
        amount: Number(body.amount),
        fund_id: body.fund_id ?? MOCK_INVESTMENTS[idx].fund_id,
        investor_id: body.investor_id ?? MOCK_INVESTMENTS[idx].investor_id,
        date: body.date ? new Date(body.date).toISOString() : MOCK_INVESTMENTS[idx].date,
        notes: body.notes ?? MOCK_INVESTMENTS[idx].notes,
        status: body.status ?? MOCK_INVESTMENTS[idx].status,
      },
    };
    MOCK_INVESTMENTS[idx] = updated;
    return NextResponse.json({ investment: updated });
  }

  try {
    const { data, error } = await supabase.from('investments').update(body).eq('id', body.id).select().maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ investment: data });
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
  if (!body.id) return NextResponse.json({ error: 'Missing investment id' }, { status: 400 });

  if (!supabase) {
    const idx = MOCK_INVESTMENTS.findIndex((i) => i.id === body.id);
    if (idx === -1) return NextResponse.json({ error: 'Investment not found' }, { status: 404 });
    MOCK_INVESTMENTS.splice(idx, 1);
    return NextResponse.json({ success: true });
  }

  try {
    const { error } = await supabase.from('investments').delete().eq('id', body.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 });
  }
}
