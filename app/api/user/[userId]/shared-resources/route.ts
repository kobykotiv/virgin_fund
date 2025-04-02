import { NextRequest, NextResponse } from 'next/server';
import { getSharedResourcesByUserId, getSharedResourcesByType } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Security check - ensure the user is only accessing their own resources
    if (session.user.id !== params.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    const searchParams = request.nextUrl.searchParams;
    const resourceType = searchParams.get('resourceType');
    
    let resources;
    
    if (resourceType && resourceType !== 'all') {
      resources = await getSharedResourcesByType(params.userId, resourceType);
    } else {
      resources = await getSharedResourcesByUserId(params.userId);
    }
    
    return NextResponse.json({ resources });
  } catch (error) {
    console.error('Error fetching shared resources:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch shared resources' }, 
      { status: 500 }
    );
  }
}
