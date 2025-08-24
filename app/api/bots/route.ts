import { NextRequest, NextResponse } from 'next/server'
import type { Bot } from '@/types/api'

// Keep a single, small in-memory list for dev/demo. Replace with database logic in prod.
const botsStore: Bot[] = []

function randomName() {
  const adjectives = ['silent', 'red', 'quick', 'clever', 'brave', 'wise', 'neon', 'iron', 'lucky', 'calm', 'bold', 'silver', 'golden']
  const nouns = ['falcon', 'otter', 'tiger', 'raccoon', 'puppy', 'whale', 'rocket', 'vector', 'quasar', 'monolith', 'harbor', 'bridge', 'forge']
  const a = adjectives[Math.floor(Math.random() * adjectives.length)]
  const b = nouns[Math.floor(Math.random() * nouns.length)]
  const num = Math.floor(Math.random() * 9999)
  return `${a}-${b}-${num}`
}

export async function GET() {
  return NextResponse.json({ data: botsStore })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const name = body.name || randomName()
    const bot: Bot = {
      id: body.id || 'bot_' + Math.random().toString(36).slice(2),
      name,
      strategy: body.strategy || 'dca',
      assets: body.assets || [],
      allocation: typeof body.allocation === 'number' ? body.allocation : Number(body.allocation || 0),
      currency: body.currency || 'USD',
      status: body.status || 'paused',
      scheduleCron: body.scheduleCron,
      createdAt: new Date().toISOString(),
      ownerId: body.ownerId || 'dev',
      initialBalance: typeof body.initialBalance === 'number' ? body.initialBalance : undefined,
    }
    botsStore.push(bot)
    return NextResponse.json({ data: bot }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
