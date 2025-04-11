import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createBotManager } from "@/lib/services/bot-manager";
import prisma from "@/lib/db/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { active } = await request.json();
    
    if (typeof active !== "boolean") {
      return new NextResponse("Invalid status value", { status: 400 });
    }

    // Get the bot and ensure it belongs to the user
    const bot = await prisma.bot.findUnique({
      where: { 
        id: params.id,
        userId: session.user.id
      }
    });

    if (!bot) {
      return new NextResponse("Bot not found", { status: 404 });
    }

    const botManager = await createBotManager(bot.id);

    // Validate settings before activation
    if (active) {
      const errors = await botManager.validateSettings();
      if (errors.length > 0) {
        return NextResponse.json(
          { errors },
          { status: 400 }
        );
      }

      // Check if user has necessary trading account and API keys
      const tradingAccount = await prisma.tradingAccount.findFirst({
        where: {
          userId: session.user.id,
          status: 'active'
        }
      });

      if (!tradingAccount) {
        return NextResponse.json({
          error: "No active trading account found. Please set up your trading account first."
        }, { status: 400 });
      }

      const apiKey = await prisma.apiKey.findFirst({
        where: {
          userId: session.user.id,
          provider: tradingAccount.provider,
          status: 'active'
        }
      });

      if (!apiKey) {
        return NextResponse.json({
          error: "No valid API key found. Please configure your API keys first."
        }, { status: 400 });
      }

      // Update bot status to running
      await botManager.updateStatus({
        state: 'running',
        message: 'Bot activated',
        lastUpdate: new Date(),
        performance: {
          totalTrades: 0,
          winRate: 0,
          totalProfit: 0,
          totalFees: 0
        }
      });
    } else {
      // Cancel any open orders before deactivating
      const openOrders = await botManager.getOpenOrders();
      if (openOrders.length > 0) {
        // TODO: Implement order cancellation logic
        console.log(`Cancelling ${openOrders.length} open orders for bot ${bot.id}`);
      }

      // Update bot status to idle
      await botManager.updateStatus({
        state: 'idle',
        message: 'Bot deactivated',
        lastUpdate: new Date()
      });
    }

    // Update the bot's active status
    const updatedBot = await prisma.bot.update({
      where: { id: params.id },
      data: { 
        active,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      ...updatedBot,
      message: active ? 'Bot activated successfully' : 'Bot deactivated successfully'
    });

  } catch (error) {
    console.error("Error updating bot status:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal server error",
      { status: 500 }
    );
  }
}

// Get bot status
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const botManager = await createBotManager(params.id);
    
    // Get bot performance metrics for the last 24 hours
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const performance = await botManager.getPerformance({
      start: yesterday,
      end: now
    });

    const recentTrades = await botManager.getRecentTrades(5);
    const openOrders = await botManager.getOpenOrders();

    return NextResponse.json({
      performance,
      recentTrades,
      openOrders
    });

  } catch (error) {
    console.error("Error fetching bot status:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal server error",
      { status: 500 }
    );
  }
}
