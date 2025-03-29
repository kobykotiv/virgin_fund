import { NextResponse } from 'next/server'
import { BotService } from '@/services/bot-service'

const botService = new BotService()

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const index = await botService.createIndex(data)
    return NextResponse.json(index)
  } catch (error) {
    console.error('Error creating index:', error)
    return NextResponse.json({ error: 'Failed to create index' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = Object.fromEntries(searchParams.entries())
    const indexes = await botService.getIndexes(filter)
    return NextResponse.json(indexes)
  } catch (error) {
    console.error('Error fetching indexes:', error)
    return NextResponse.json({ error: 'Failed to fetch indexes' }, { status: 500 })
  }
}