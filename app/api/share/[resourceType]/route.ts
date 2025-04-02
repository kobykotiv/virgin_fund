import { NextRequest, NextResponse } from 'next/server';
import { 
  shareBacktest, 
  sharePortfolio, 
  shareBot, 
  shareStrategy 
} from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { resourceType: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resourceType = params.resourceType;
    const data = await request.json();
    const { resourceId, visibility, options } = data;
    
    if (!resourceId || !visibility) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    // Use the user ID from the session for security
    const userId = session.user.id;
    
    // Use the appropriate helper function based on resource type
    let result;
    
    switch (resourceType) {
      case 'backtest':
        result = await shareBacktest(userId, resourceId, visibility, options);
        break;
      case 'portfolio':
        result = await sharePortfolio(userId, resourceId, visibility, options);
        break;
      case 'bot':
        result = await shareBot(userId, resourceId, visibility, options);
        break;
      case 'strategy':
        result = await shareStrategy(userId, resourceId, visibility, options);
        break;
      default:
        return NextResponse.json({ error: 'Invalid resource type' }, { status: 400 });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error sharing resource:', error);
    return NextResponse.json({ error: error.message || 'Failed to share resource' }, { status: 500 });
  }
}
