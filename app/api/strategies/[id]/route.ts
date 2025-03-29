import { NextResponse } from 'next/server'
import { BotService } from '@/services/bot-service'

const botService = new BotService()

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const strategy = await botService.getStrategyById(params.id)
    if (!strategy) {
      return NextResponse.json({ error: 'Strategy not found' }, { status: 404 })
    }
    return NextResponse.json(strategy)
  } catch (error) {
    console.error('Error fetching strategy:', error)
    return NextResponse.json({ error: 'Failed to fetch strategy' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const strategy = await botService.updateStrategy(params.id, data)
    if (!strategy) {
      return NextResponse.json({ error: 'Strategy not found' }, { status: 404 })
    }
    return NextResponse.json(strategy)
  } catch (error) {
    console.error('Error updating strategy:', error)
    return NextResponse.json({ error: 'Failed to update strategy' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const success = await botService.deleteStrategy(params.id)
    if (!success) {
      return NextResponse.json({ error: 'Strategy not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting strategy:', error)
    return NextResponse.json({ error: 'Failed to delete strategy' }, { status: 500 })
  }
}