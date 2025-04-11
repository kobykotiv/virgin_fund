import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db/prisma";

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Verify bot ownership
    const bot = await prisma.bot.findUnique({
      where: { 
        id: params.id,
        userId: session.user.id
      }
    });

    if (!bot) {
      return new Response("Bot not found", { status: 404 });
    }

    // Set up SSE headers
    const encoder = new TextEncoder();
    const customReadable = new ReadableStream({
      async start(controller) {
        // Send initial state
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'init' })}\n\n`));

        // Set up interval for status updates
        const interval = setInterval(async () => {
          try {
            const updatedBot = await prisma.bot.findUnique({
              where: { id: params.id },
              include: {
                trades: {
                  orderBy: { timestamp: 'desc' },
                  take: 1,
                },
                orders: {
                  where: { status: 'open' },
                  orderBy: { createdAt: 'desc' },
                },
              }
            });

            if (!updatedBot) {
              clearInterval(interval);
              controller.close();
              return;
            }

            // Send bot status update
            const update = {
              type: 'update',
              timestamp: new Date(),
              status: updatedBot.status,
              lastTrade: updatedBot.trades[0],
              openOrders: updatedBot.orders.length,
            };

            controller.enqueue(encoder.encode(`data: ${JSON.stringify(update)}\n\n`));
          } catch (error) {
            console.error('Error fetching bot updates:', error);
          }
        }, 5000); // Update every 5 seconds

        // Clean up on disconnect
        request.signal.addEventListener('abort', () => {
          clearInterval(interval);
          controller.close();
        });
      }
    });

    return new Response(customReadable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error setting up SSE:', error);
    return new Response("Internal server error", { status: 500 });
  }
}
