import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'
import { getDemoAccountsFromJSON } from '@/lib/demo-accounts'

// GET /api/portfolios - Get all portfolios for the current user or demo portfolios
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'demo' or 'user'
    const userId = searchParams.get('userId')

    if (type === 'demo') {
      // Get demo portfolios from JSON data
      const demoAccounts = await getDemoAccountsFromJSON()

      // Transform demo accounts to portfolio format
      const portfolios = demoAccounts.map((account: any) => ({
        id: account.id,
        name: account.name,
        user_id: userId || 'demo-user',
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
          bot_id: null // Demo positions don't have associated bots
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
      }))

      return NextResponse.json(portfolios)
    } else {
      // Get user portfolios (aggregate from user's bots and positions)
      if (!userId) {
        return NextResponse.json({ error: 'User ID is required for user portfolios' }, { status: 400 })
      }

      // Get user's bots
      const { data: bots, error: botsError } = await supabase
        .from('bots')
        .select(`
          *,
          positions (*)
        `)
        .eq('user_id', userId)

      if (botsError) {
        console.error('Error fetching user bots:', botsError)
        return NextResponse.json({ error: 'Failed to fetch user portfolios' }, { status: 500 })
      }

      // Create virtual portfolios from bots
      const portfolios = bots.map((bot: any) => ({
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
      }))

      return NextResponse.json(portfolios)
    }
  } catch (error) {
    console.error('Error in portfolios GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/portfolios - Create a new portfolio
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, userId, name, currency = 'USD' } = body

    if (type === 'demo') {
      if (!userId) {
        return NextResponse.json({ error: 'User ID is required for demo portfolios' }, { status: 400 })
      }

      // For demo portfolios, we'll create a virtual portfolio from demo data
      const demoAccounts = await getDemoAccountsFromJSON()
      const demoAccount = demoAccounts.find((acc: any) => acc.id === userId) || demoAccounts[0]

      const portfolio = {
        id: `demo-${Date.now()}`,
        name: name || `${demoAccount.name} Portfolio`,
        user_id: userId,
        total_value: demoAccount.portfolioValue,
        cash_balance: demoAccount.portfolio.cash,
        currency,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        positions: demoAccount.portfolio.positions,
        bots: demoAccount.bots
      }

      return NextResponse.json(portfolio, { status: 201 })
    } else {
      // Create user portfolio (create a bot that represents the portfolio)
      if (!userId || !name) {
        return NextResponse.json({ error: 'User ID and name are required for user portfolios' }, { status: 400 })
      }

      const { data: bot, error } = await supabase
        .from('bots')
        .insert({
          user_id: userId,
          name: name,
          type: 'portfolio',
          status: 'active',
          capital_allocated: 0,
          risk_tolerance: 'medium',
          description: 'User-created portfolio'
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating portfolio bot:', error)
        return NextResponse.json({ error: 'Failed to create portfolio' }, { status: 500 })
      }

      const portfolio = {
        id: bot.id,
        name: bot.name,
        user_id: bot.user_id,
        total_value: bot.capital_allocated,
        cash_balance: bot.capital_allocated,
        currency,
        status: bot.status,
        created_at: bot.created_at,
        updated_at: bot.updated_at,
        positions: [],
        bots: [bot]
      }

      return NextResponse.json(portfolio, { status: 201 })
    }
  } catch (error) {
    console.error('Error in portfolios POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
