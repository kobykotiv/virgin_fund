import { NextResponse } from 'next/server'
import { BotService } from '@/services/bot-service'

const botService = new BotService()

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const index = await botService.getIndexById(params.id)
    if (!index) {
      return NextResponse.json({ error: 'Index not found' }, { status: 404 })
    }
    return NextResponse.json(index)
  } catch (error) {
    console.error('Error fetching index:', error)
    return NextResponse.json({ error: 'Failed to fetch index' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const index = await botService.updateIndex(params.id, data)
    if (!index) {
      return NextResponse.json({ error: 'Index not found' }, { status: 404 })
    }
    return NextResponse.json(index)
  } catch (error) {
    console.error('Error updating index:', error)
    return NextResponse.json({ error: 'Failed to update index' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const success = await botService.deleteIndex(params.id)
    if (!success) {
      return NextResponse.json({ error: 'Index not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting index:', error)
    return NextResponse.json({ error: 'Failed to delete index' }, { status: 500 })
  }
}