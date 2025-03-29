import { NextResponse } from 'next/server'
import { BotService } from '@/services/bot-service'

const botService = new BotService()

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const bot = await botService.createBot(data)
    return NextResponse.json(bot)
  } catch (error) {
    console.error('Error creating bot:', error)
    return NextResponse.json({ error: 'Failed to create bot' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = Object.fromEntries(searchParams.entries())
    const bots = await botService.getBots(filter)
    return NextResponse.json(bots)
  } catch (error) {
    console.error('Error fetching bots:', error)
    return NextResponse.json({ error: 'Failed to fetch bots' }, { status: 500 })
  }
}