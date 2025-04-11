import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient, Prisma } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema for creating a bot
// Adjust based on required fields for different bot types later
const createBotSchema = z.object({
  name: z.string().min(1, "Bot name is required"),
  description: z.string().optional(),
  type: z.enum(['DCA', 'Indicator', 'BasketRebalance']), // Add other types as needed
  strategy: z.string().min(1, "Strategy identifier is required"),
  settings: z.record(z.any()).optional(), // Validate specific settings based on type later
});

// GET handler to list bots for the authenticated user
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const bots = await prisma.tradingBot.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }, // Or order by name, etc.
    });

    // Convert settings and executionHistory from Prisma JsonValue if needed
    const formattedBots = bots.map(bot => ({
        ...bot,
        settings: bot.settings as Prisma.JsonObject | null, // Type assertion
        executionHistory: bot.executionHistory as Prisma.JsonArray | null // Type assertion
    }));


    return NextResponse.json(formattedBots);

  } catch (error) {
    console.error('Error fetching bots:', error);
    return NextResponse.json({ error: 'Failed to fetch bots' }, { status: 500 });
  }
}

// POST handler to create a new bot
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = createBotSchema.parse(body);

    // TODO: Add specific validation for settings based on validatedData.type

    const newBot = await prisma.tradingBot.create({
      data: {
        userId: session.user.id,
        name: validatedData.name,
        description: validatedData.description,
        type: validatedData.type,
        strategy: validatedData.strategy,
        settings: (validatedData.settings ?? {}) as Prisma.InputJsonObject, // Store settings as JSON
        status: 'paused', // Default status
        active: false,     // Default active state
      },
    });

     // Convert settings and executionHistory from Prisma JsonValue if needed
     const formattedBot = {
        ...newBot,
        settings: newBot.settings as Prisma.JsonObject | null, // Type assertion
        executionHistory: newBot.executionHistory as Prisma.JsonArray | null // Type assertion
    };

    return NextResponse.json(formattedBot, { status: 201 });

  } catch (error) {
    console.error('Error creating bot:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create bot' }, { status: 500 });
  }
}
