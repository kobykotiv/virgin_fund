import { NextRequest, NextResponse } from 'next/server';
import { marketDataCache } from '@/services/market-data-cache';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const activityType = searchParams.get('type') || 'FILL';
    const date = searchParams.get('date') || undefined;

    const activities = await marketDataCache.getAccountActivities(activityType, date);
    
    return NextResponse.json({ 
      success: true, 
      data: activities 
    });
  } catch (error) {
    console.error('Error fetching account activities:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch account activities',
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
