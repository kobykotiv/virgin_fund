import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Fetch market data from an external API
    const response = await fetch('https://api.example.com/market-data')
    const data = await response.json()
    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 })
  }
}
