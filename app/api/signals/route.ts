import { NextResponse } from 'next/server'
import { BotService } from '@/services/bot-service'

const botService = new BotService()

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const signal = await botService.createSignal(data)
    return NextResponse.json(signal)
  } catch (error) {
    console.error('Error creating signal:', error)
    return NextResponse.json({ error: 'Failed to create signal' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = Object.fromEntries(searchParams.entries())
    const signals = await botService.getSignals(filter)
    return NextResponse.json(signals)
  } catch (error) {
    console.error('Error fetching signals:', error)
    return NextResponse.json({ error: 'Failed to fetch signals' }, { status: 500 })
  }
}