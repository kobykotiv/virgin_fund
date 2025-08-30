import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'
import { getDemoAccountsFromJSON, fetchDemoAccount } from '@/lib/demo-accounts'

interface RouteParams {
  params: { id: string }
}

// GET /api/portfolios/[id] - Get specific portfolio
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'demo' or 'user'

    if (type === 'demo') {
      // Get demo portfolio from JSON data
      const result = await fetchDemoAccount(params.id)

      if (!result.success) {
        return NextResponse.json({ error: result.error || 'Demo portfolio not found' }, { status: 404 })
      }

      // Transform demo account to portfolio format
      const account = result.data!
      const portfolio = {
        id: account.id,
        name: account.name,
        user_id: 'demo-user',
        total_value: account.portfolioValue,
        cash_balance: account.portfolio.cash,
        currency: 'USD',
        status: account.status,
        created_at: account.createdAt,
        updated_at: account.lastLogin,
        positions: account.portfolio.positions.map((pos: any) => ({
          id: `${account.id}-${pos.symbol}`,
          symbol: pos.symbol,
          quantity: pos.quantity,
          avg_price: pos.avgPrice,
          current_price: pos.currentPrice,
          market_value: pos.marketValue,
          unrealized_pnl: pos.unrealizedPnL,
          unrealized_pnl_percent: pos.unrealizedPnLPercent,
          bot_id: null
        })),
        bots: account.bots.map((bot: any) => ({
          id: bot.id,
          name: bot.name,
          type: bot.type,
          status: bot.status,
          capital_allocated: bot.allocation,
          total_pnl: bot.performance.totalPnL,
          win_rate: bot.performance.winRate
        }))
      }

      return NextResponse.json(portfolio)
    } else {
      // Get user portfolio (from bot)
      const { data: bot, error } = await supabase
        .from('bots')
        .select(`
          *,
          positions (*)
        `)
        .eq('id', params.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })
        }
        console.error('Error fetching user portfolio:', error)
        return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 })
      }

      // Transform bot to portfolio format
      const portfolio = {
        id: bot.id,
        name: `${bot.name} Portfolio`,
        user_id: bot.user_id,
        total_value: bot.capital_allocated + (bot.total_pnl || 0),
        cash_balance: bot.capital_allocated - (bot.positions?.reduce((sum: number, pos: any) => sum + (pos.total_cost || 0), 0) || 0),
        currency: 'USD',
        status: bot.status,
        created_at: bot.created_at,
        updated_at: bot.updated_at,
        positions: bot.positions || [],
        bots: [bot]
      }

      return NextResponse.json(portfolio)
    }
  } catch (error) {
    console.error('Error in portfolio GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/portfolios/[id] - Update portfolio
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json()
    const { type, ...updateData } = body

    if (type === 'demo') {
      // Update demo portfolio
      const { data: portfolio, error } = await supabase
        .from('demo_portfolios')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.id)
        .select(`
          *,
          demo_trades (*),
          demo_bots (*),
          demo_strategies (*)
        `)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json({ error: 'Demo portfolio not found' }, { status: 404 })
        }
        console.error('Error updating demo portfolio:', error)
        return NextResponse.json({ error: 'Failed to update demo portfolio' }, { status: 500 })
      }

      return NextResponse.json(portfolio)
    } else {
      // Handle user portfolio updating
      return NextResponse.json({ error: 'User portfolio updating not implemented yet' }, { status: 501 })
    }
  } catch (error) {
    console.error('Error in portfolio PUT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/portfolios/[id] - Delete portfolio
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'demo' or 'user'

    if (type === 'demo') {
      // Delete demo portfolio and related data
      const deletePromises = [
        supabase.from('demo_trades').delete().eq('portfolio_id', params.id),
        supabase.from('demo_bots').delete().eq('portfolio_id', params.id),
        supabase.from('demo_strategies').delete().eq('portfolio_id', params.id),
        supabase.from('demo_portfolios').delete().eq('id', params.id)
      ]

      const results = await Promise.all(deletePromises)

      // Check if any deletions failed
      const errors = results.filter(result => result.error)
      if (errors.length > 0) {
        console.error('Error deleting demo portfolio data:', errors)
        return NextResponse.json({ error: 'Failed to delete demo portfolio' }, { status: 500 })
      }

      return NextResponse.json({ message: 'Demo portfolio deleted successfully' })
    } else {
      // Handle user portfolio deletion
      return NextResponse.json({ error: 'User portfolio deletion not implemented yet' }, { status: 501 })
    }
  } catch (error) {
    console.error('Error in portfolio DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
