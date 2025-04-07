import { NextRequest, NextResponse } from 'next/server';
import { marketDataCache } from '@/services/market-data-cache';
import { authMiddleware, AuthRequest } from '@/middleware/authMiddleware';

export async function GET(req: NextRequest) {
  // Apply authentication
  const authResponse = await authMiddleware(req as AuthRequest);
  if (authResponse) return authResponse;
  
  try {
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status') || 'open';

    const orders = await marketDataCache.getOrders(status);
    
    return NextResponse.json({ 
      success: true, 
      data: orders 
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch orders',
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
