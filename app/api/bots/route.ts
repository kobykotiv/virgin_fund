import { NextResponse } from 'next/server'
import { initDB } from '@/lib/db'

export async function GET() {
  try {
    const db = await initDB()
    const bots = await db.getAll('bots')
    return NextResponse.json({ data: bots })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bots' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const db = await initDB()
    await db.add('bots', body)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add bot' }, { status: 500 })
  }
}
