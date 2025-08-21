import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/middleware/sessionMiddleware';
import * as keysService from '@/services/keys-service';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await requireSession(req);
    // In Next.js app router, route params are not available on NextRequest at runtime
    // Parse the id segment from the pathname: /api/keys/:id/reveal
    const url = new URL(req.url);
    const parts = url.pathname.split('/').filter(Boolean);
    // parts should be ["api","keys",":id","reveal"]
    const idIndex = parts.findIndex((p) => p === 'keys') + 1;
    const id = parts[idIndex];
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    // Optionally check session freshness here (e.g., last_activity < 5min)
    const secret = await keysService.revealKey(userId, id);
    return NextResponse.json({ data: secret });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unauthorized' }, { status: 401 });
  }
}
