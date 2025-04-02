import { NextRequest, NextResponse } from 'next/server';
import { 
  updateSharedResource,
  deleteSharedResource,
  extendSharedResourceExpiration
} from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { shareId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shareId = params.shareId;
    const data = await request.json();
    const { title, description, visibility, ttlDays, accessRestrictions } = data;
    
    // Use the user ID from the session for security
    const userId = session.user.id;
    
    const updateData: any = {};
    
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (visibility) updateData.visibility = visibility;
    if (accessRestrictions) updateData.accessRestrictions = accessRestrictions;
    
    // If ttlDays is provided, extend the expiration
    if (ttlDays) {
      await extendSharedResourceExpiration(userId, shareId, ttlDays);
    }
    
    // Only update other fields if there are any
    if (Object.keys(updateData).length > 0) {
      await updateSharedResource(userId, shareId, updateData);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating shared resource:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update shared resource' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { shareId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shareId = params.shareId;
    
    // Use the user ID from the session for security
    const userId = session.user.id;
    
    await deleteSharedResource(userId, shareId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting shared resource:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete shared resource' }, 
      { status: 500 }
    );
  }
}
