import { NextResponse } from 'next/server'
import { initDB } from '@/lib/db'

export async function GET() {
  try {
    const db = await initDB()
    const signals = await db.getAll('signals')
    return NextResponse.json({ data: signals })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch signals' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const db = await initDB()
    await db.add('signals', body)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add signal' }, { status: 500 })
  }
}
