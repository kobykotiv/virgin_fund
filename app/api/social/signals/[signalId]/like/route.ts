import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { signalId: string } }
) {
  try {
    const { signalId } = params

    // In a real app, this would update the database
    // For now, we'll just return success
    return NextResponse.json({
      success: true,
      message: 'Signal liked'
    })
  } catch (error) {
    console.error('Error liking signal:', error)
    return NextResponse.json(
      { error: 'Failed to like signal' },
      { status: 500 }
    )
  }
}
