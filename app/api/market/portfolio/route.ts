import { NextRequest, NextResponse } from 'next/server';
import { marketDataCache } from '@/services/market-data-cache';
import { authMiddleware, AuthRequest } from '@/middleware/authMiddleware';

export async function GET(req: NextRequest) {
  // Apply authentication
  const authResponse = await authMiddleware(req as AuthRequest);
  if (authResponse) return authResponse;
  
  try {
    const searchParams = req.nextUrl.searchParams;
    const timeframe = searchParams.get('timeframe') || '1M'; // Default to 1 month
    
    const portfolioData = await marketDataCache.getPortfolioHistory(timeframe);
    
    return NextResponse.json({ 
      success: true, 
      data: portfolioData 
    });
  } catch (error) {
    console.error('Error fetching portfolio history:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch portfolio history',
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
