import { NextResponse } from 'next/server'
import { initDB } from '@/lib/db'

export async function GET() {
  try {
    const db = await initDB()
    const portfolio = await db.getAll('portfolio')
    return NextResponse.json({ data: portfolio })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const db = await initDB()
    await db.add('portfolio', body)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add portfolio item' }, { status: 500 })
  }
}
