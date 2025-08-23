import { NextRequest, NextResponse } from 'next/server';
import { marketDataCache } from '@/services/market-data-cache';
import { authMiddleware } from '@/middleware/authMiddleware';

export async function GET(req: NextRequest) {
  // Apply authentication
  const authResponse = await authMiddleware(req);
  if (authResponse) return authResponse;
  
  try {
    const accountData = await marketDataCache.getAccount();
    
    return NextResponse.json({ 
      success: true, 
      data: accountData 
    });
  } catch (error) {
    console.error('Error fetching account data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch account data',
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
