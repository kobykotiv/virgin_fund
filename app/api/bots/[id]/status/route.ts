import { NextRequest, NextResponse } from 'next/server';
import { BotService } from '@/services/bot-service';
import { BotStatus } from '@/types/bot';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { status } = await request.json();
    if (!status || !['active', 'paused', 'error'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const bot = await BotService.toggleBotStatus(params.id, status as BotStatus);
    if (!bot) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
    }

    return NextResponse.json(bot);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update bot status' }, { status: 500 });
  }
}