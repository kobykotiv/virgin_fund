import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'
import { fetchDemoAccount } from '@/lib/demo-accounts'

interface RouteParams {
  params: { id: string; positionId: string }
}

// GET /api/portfolios/[id]/positions/[positionId] - Get specific position
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'demo' or 'user'

    if (type === 'demo') {
      // Get demo portfolio from JSON data
      const result = await fetchDemoAccount(params.id)

      if (!result.success) {
        return NextResponse.json({ error: result.error || 'Portfolio not found' }, { status: 404 })
      }

      const account = result.data!
      const position = account.portfolio.positions.find((pos: any) =>
        `${account.id}-${pos.symbol}` === params.positionId
      )

      if (!position) {
        return NextResponse.json({ error: 'Position not found' }, { status: 404 })
      }

      const formattedPosition = {
        id: `${account.id}-${position.symbol}`,
        symbol: position.symbol,
        quantity: position.quantity,
        avg_price: position.avgPrice,
        current_price: position.currentPrice,
        market_value: position.marketValue,
        unrealized_pnl: position.unrealizedPnL,
        unrealized_pnl_percent: position.unrealizedPnLPercent,
        portfolio_id: account.id,
        created_at: account.createdAt,
        updated_at: account.lastLogin
      }

      return NextResponse.json(formattedPosition)
    } else {
      // Get user position from Supabase
      const { data: position, error } = await supabase
        .from('positions')
        .select('*')
        .eq('id', params.positionId)
        .eq('bot_id', params.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json({ error: 'Position not found' }, { status: 404 })
        }
        console.error('Error fetching position:', error)
        return NextResponse.json({ error: 'Failed to fetch position' }, { status: 500 })
      }

      return NextResponse.json(position)
    }
  } catch (error) {
    console.error('Error in position GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/portfolios/[id]/positions/[positionId] - Update position
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json()
    const { type, ...updateData } = body

    if (type === 'demo') {
      // Demo positions are read-only
      return NextResponse.json({ error: 'Demo positions cannot be modified' }, { status: 403 })
    } else {
      // Update user position
      const { data: position, error } = await supabase
        .from('positions')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.positionId)
        .eq('bot_id', params.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating position:', error)
        return NextResponse.json({ error: 'Failed to update position' }, { status: 500 })
      }

      return NextResponse.json(position)
    }
  } catch (error) {
    console.error('Error in position PUT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/portfolios/[id]/positions/[positionId] - Delete position
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'demo' or 'user'

    if (type === 'demo') {
      // Demo positions are read-only
      return NextResponse.json({ error: 'Demo positions cannot be modified' }, { status: 403 })
    } else {
      // Delete user position
      const { error } = await supabase
        .from('positions')
        .delete()
        .eq('id', params.positionId)
        .eq('bot_id', params.id)

      if (error) {
        console.error('Error deleting position:', error)
        return NextResponse.json({ error: 'Failed to delete position' }, { status: 500 })
      }

      return NextResponse.json({ message: 'Position deleted successfully' })
    }
  } catch (error) {
    console.error('Error in position DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
