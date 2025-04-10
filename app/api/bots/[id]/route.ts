import { NextRequest, NextResponse } from 'next/server';
import { BotService } from '@/services/bot-service';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const bot = await BotService.getBot(params.id);
    if (!bot) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
    }
    return NextResponse.json(bot);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bot' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const updates = await request.json();
    const bot = await BotService.updateBot(params.id, updates);
    if (!bot) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
    }
    return NextResponse.json(bot);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update bot' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const success = await BotService.deleteBot(params.id);
    if (!success) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete bot' }, { status: 500 });
  }
}