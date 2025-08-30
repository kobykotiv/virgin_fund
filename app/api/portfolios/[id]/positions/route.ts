import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'
import { fetchDemoAccount } from '@/lib/demo-accounts'

interface RouteParams {
  params: { id: string }
}

// GET /api/portfolios/[id]/positions - Get all positions for a portfolio
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
      const positions = account.portfolio.positions.map((pos: any) => ({
        id: `${account.id}-${pos.symbol}`,
        symbol: pos.symbol,
        quantity: pos.quantity,
        avg_price: pos.avgPrice,
        current_price: pos.currentPrice,
        market_value: pos.marketValue,
        unrealized_pnl: pos.unrealizedPnL,
        unrealized_pnl_percent: pos.unrealizedPnLPercent,
        portfolio_id: account.id,
        created_at: account.createdAt,
        updated_at: account.lastLogin
      }))

      return NextResponse.json(positions)
    } else {
      // Get user portfolio positions from Supabase
      const { data: positions, error } = await supabase
        .from('positions')
        .select('*')
        .eq('bot_id', params.id) // Assuming portfolio id maps to bot id

      if (error) {
        console.error('Error fetching user portfolio positions:', error)
        return NextResponse.json({ error: 'Failed to fetch portfolio positions' }, { status: 500 })
      }

      return NextResponse.json(positions || [])
    }
  } catch (error) {
    console.error('Error in positions GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/portfolios/[id]/positions - Add position to portfolio
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json()
    const { type, ...positionData } = body

    if (type === 'demo') {
      // Demo positions are read-only from JSON
      return NextResponse.json({ error: 'Demo positions cannot be modified' }, { status: 403 })
    } else {
      // Add position to user portfolio (bot)
      const { data: position, error } = await supabase
        .from('positions')
        .insert({
          ...positionData,
          bot_id: params.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating position:', error)
        return NextResponse.json({ error: 'Failed to create position' }, { status: 500 })
      }

      return NextResponse.json(position, { status: 201 })
    }
  } catch (error) {
    console.error('Error in positions POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
