import { NextRequest, NextResponse } from 'next/server';
import { marketDataCache } from '@/services/market-data-cache';
import { authMiddleware } from '@/middleware/authMiddleware';

export async function GET(req: NextRequest) {
  // Apply authentication
  const authResponse = await authMiddleware(req);
  if (authResponse) return authResponse;
  
  try {
    const positions = await marketDataCache.getPositions();
    
    return NextResponse.json({ 
      success: true, 
      data: positions 
    });
  } catch (error) {
    console.error('Error fetching positions:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch positions',
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
