import { NextRequest, NextResponse } from 'next/server';
import { getPublicResources, searchPublicResources } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const resourceType = searchParams.get('resourceType') || undefined;
    const search = searchParams.get('search') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const sortBy = searchParams.get('sortBy') || 'accessCount';
    const sortOrder = parseInt(searchParams.get('sortOrder') || '-1', 10);
    
    const skip = (page - 1) * limit;
    
    let resources;
    let total;
    
    if (search) {
      // If search is provided, use the search function
      resources = await searchPublicResources(
        search,
        resourceType,
        limit,
        skip
      );
      
      // For proper pagination, we need the total count
      // In a real application, this would be a separate count query
      total = resources.length + skip; // This is an approximation
    } else {
      // Otherwise get regular public resources
      resources = await getPublicResources(
        resourceType,
        limit,
        skip,
        sortBy,
        sortOrder
      );
      
      // Similar approximation for total
      total = resources.length + skip;
      
      // In a real application, you would have a count method
      // total = await countPublicResources(resourceType);
    }
    
    return NextResponse.json({
      resources,
      total,
      page,
      limit
    });
  } catch (error) {
    console.error('Error fetching public resources:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch public resources' }, 
      { status: 500 }
    );
  }
}
