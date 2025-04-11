import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient, Prisma } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema for updating bot status
const updateStatusSchema = z.object({
  active: z.boolean(), // Expecting a boolean 'active' field in the request body
});

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
    const validatedData = updateStatusSchema.parse(body);

    // Ensure the bot exists and belongs to the user before updating status
    const existingBot = await prisma.tradingBot.findUnique({
       where: { id: botId, userId: session.user.id },
       select: { id: true, status: true } // Select current status if needed for logic
    });

    if (!existingBot) {
       return NextResponse.json({ error: 'Bot not found or not owned by user' }, { status: 404 });
    }

    // Determine the new status based on the 'active' flag
    // You might add more complex logic here, e.g., checking if credentials are set
    const newStatus = validatedData.active ? 'active' : 'paused';

    const updatedBot = await prisma.tradingBot.update({
      where: { 
        id: botId,
      },
      data: {
        active: validatedData.active,
        status: newStatus, // Update status along with active flag
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
    console.error(`Error updating bot status ${botId}:`, error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
     // Handle potential Prisma errors
     if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
     }
    return NextResponse.json({ error: 'Failed to update bot status' }, { status: 500 });
  }
}
