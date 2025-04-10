import { NextRequest, NextResponse } from 'next/server';
import { BotService } from '@/services/bot-service';

export async function GET() {
  try {
    const bots = await BotService.listBots();
    return NextResponse.json(bots);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bots' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const botData = await request.json();
    const bot = await BotService.createBot(botData);
    return NextResponse.json(bot, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create bot' }, { status: 500 });
  }
}