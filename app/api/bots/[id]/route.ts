import { NextResponse } from 'next/server'
import { BotService } from '@/services/bot-service'

const botService = new BotService()

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const bot = await botService.getBotById(params.id)
    if (!bot) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
    }
    return NextResponse.json(bot)
  } catch (error) {
    console.error('Error fetching bot:', error)
    return NextResponse.json({ error: 'Failed to fetch bot' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const bot = await botService.updateBot(params.id, data)
    if (!bot) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
    }
    return NextResponse.json(bot)
  } catch (error) {
    console.error('Error updating bot:', error)
    return NextResponse.json({ error: 'Failed to update bot' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const success = await botService.deleteBot(params.id)
    if (!success) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting bot:', error)
    return NextResponse.json({ error: 'Failed to delete bot' }, { status: 500 })
  }
}