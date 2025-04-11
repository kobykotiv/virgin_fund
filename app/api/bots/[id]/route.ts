import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient, Prisma } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema for updating a bot
// Allow partial updates, refine based on what fields are updatable
const updateBotSchema = z.object({
  name: z.string().min(10, "Bot name is required").optional(),
  description: z.string().optional().nullable(),
  // type: z.enum(['DCA', 'Indicator', 'BasketRebalance']).optional(), // Usually type is not updatable
  // strategy: z.string().min(1).optional(), // Strategy is  not be updatable
  settings: z.record(z.any()).optional(), // Validate specific settings based on type later
  // status: z.string().optional(), // Status should likely be updated via a separate endpoint
  // active: z.boolean().optional(), // Active state should be updated via a separate endpoint
});


// GET handler for a single bot
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const botId = params.id;

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const bot = await prisma.tradingBot.findUnique({
      where: { 
        id: botId,
        userId: session.user.id // Ensure user owns the bot
      },
    });

    if (!bot) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
    }

     // Convert settings and executionHistory from Prisma JsonValue if needed
     const formattedBot = {
        ...bot,
        settings: bot.settings as Prisma.JsonObject | null, // Type assertion
        executionHistory: bot.executionHistory as Prisma.JsonArray | null // Type assertion
    };

    return NextResponse.json(formattedBot);

  } catch (error) {
    console.error(`Error fetching bot ${botId}:`, error);
    return NextResponse.json({ error: 'Failed to fetch bot' }, { status: 500 });
  }
}

// PUT handler to update a bot
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const botId = params.id;

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = updateBotSchema.parse(body);

    // TODO: Add specific validation for settings based on bot type if needed

    // Ensure the bot exists and belongs to the user before updating
    const existingBot = await prisma.tradingBot.findUnique({
       where: { id: botId, userId: session.user.id },
       select: { id: true } // Only need to select id to confirm existence
    });

    if (!existingBot) {
       return NextResponse.json({ error: 'Bot not found or not owned by user' }, { status: 404 });
    }

    const updatedBot = await prisma.tradingBot.update({
      where: { 
        id: botId,
        // No need for userId here again as we confirmed ownership above
      },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        settings: validatedData.settings ? validatedData.settings as Prisma.InputJsonObject : undefined,
        // Add other updatable fields here if necessary
      },
    });

     // Convert settings and executionHistory from Prisma JsonValue if needed
     const formattedBot = {
        ...updatedBot,
        settings: updatedBot.settings as Prisma.JsonObject | null, // Type assertion
        executionHistory: updatedBot.executionHistory as Prisma.JsonArray | null // Type assertion
    };

    return NextResponse.json(formattedBot);

  } catch (error) {
    console.error(`Error updating bot ${botId}:`, error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update bot' }, { status: 500 });
  }
}

// DELETE handler to remove a bot
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const botId = params.id;

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
     // Ensure the bot exists and belongs to the user before deleting
     const existingBot = await prisma.tradingBot.findUnique({
       where: { id: botId, userId: session.user.id },
       select: { id: true } // Only need to select id to confirm existence
     });

     if (!existingBot) {
       return NextResponse.json({ error: 'Bot not found or not owned by user' }, { status: 404 });
     }

    await prisma.tradingBot.delete({
      where: { 
        id: botId,
        // No need for userId here again as we confirmed ownership above
      },
    });

    return NextResponse.json({ success: true, message: 'Bot deleted successfully' }, { status: 200 }); // Or 204 No Content

  } catch (error) {
    console.error(`Error deleting bot ${botId}:`, error);
     // Handle potential Prisma errors (e.g., record not found if deleted between check and delete)
     if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
     }
    return NextResponse.json({ error: 'Failed to delete bot' }, { status: 500 });
  }
}
