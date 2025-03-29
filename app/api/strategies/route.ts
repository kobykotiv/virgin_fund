import { NextResponse } from 'next/server'
import { BotService } from '@/services/bot-service'

const botService = new BotService()

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const strategy = await botService.createStrategy(data)
    return NextResponse.json(strategy)
  } catch (error) {
    console.error('Error creating strategy:', error)
    return NextResponse.json({ error: 'Failed to create strategy' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = Object.fromEntries(searchParams.entries())
    const strategies = await botService.getStrategies(filter)
    return NextResponse.json(strategies)
  } catch (error) {
    console.error('Error fetching strategies:', error)
    return NextResponse.json({ error: 'Failed to fetch strategies' }, { status: 500 })
  }
}