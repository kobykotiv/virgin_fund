import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createBotManager } from "@/lib/services/bot-manager";
import prisma from "@/lib/db/prisma";
import { add, sub } from "date-fns";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the timeframe from query params
    const searchParams = new URL(request.url).searchParams;
    const timeframe = searchParams.get("timeframe") || "7d";

    // Calculate date range based on timeframe
    const now = new Date();
    let startDate: Date;
    
    switch (timeframe) {
      case "24h":
        startDate = sub(now, { hours: 24 });
        break;
      case "7d":
        startDate = sub(now, { days: 7 });
        break;
      case "30d":
        startDate = sub(now, { days: 30 });
        break;
        case "90d":
      case "all":
        startDate = sub(now, { years: 10 }); // Arbitrary past date
        break;
      default:
        startDate = sub(now, { days: 7 }); // Default to 7 days
    }

    // Get the bot and ensure it belongs to the user
    const bot = await prisma.bot.findUnique({
      where: { 
        id: params.id,
        userId: session.user.id
      },
      include: {
        trades: {
          where: {
            timestamp: {
              gte: startDate,
              lte: now,
            }
          },
          orderBy: {
            timestamp: 'desc'
          }
        },
        orders: {
          where: {
            createdAt: {
              gte: startDate,
              lte: now,
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!bot) {
      return new NextResponse("Bot not found", { status: 404 });
    }

    // Calculate performance metrics
    const trades = bot.trades;
    const totalTrades = trades.length;
    const profitableTrades = trades.filter(t => (t.profitLoss || 0) > 0).length;
    const totalProfit = trades.reduce((sum, t) => sum + (t.profitLoss || 0), 0);
    const totalFees = trades.reduce((sum, t) => sum + (t.commission || 0), 0);
    const netProfit = totalProfit - totalFees;

    // Calculate additional metrics
    const returns = trades.map(t => {
      if (!t.profitLoss || !t.price || !t.quantity) return 0;
      const investment = t.price * t.quantity;
      return (t.profitLoss / investment) * 100;
    });

    const averageReturn = returns.length > 0
      ? returns.reduce((sum, r) => sum + r, 0) / returns.length
      : 0;

    const profitLosses = trades.map(t => t.profitLoss || 0);
    const largestGain = Math.max(0, ...profitLosses);
    const largestLoss = Math.min(0, ...profitLosses);

    const metrics = {
      totalTrades,
      winRate: totalTrades > 0 ? (profitableTrades / totalTrades) * 100 : 0,
      totalProfit: netProfit,
      totalFees,
      averageReturn,
      largestGain,
      largestLoss,
    };

    // Update bot status with latest metrics
    await prisma.bot.update({
      where: { id: bot.id },
      data: {
        status: {
          ...bot.status,
          performance: metrics,
          lastUpdate: now,
        },
      },
    });

    return NextResponse.json({
      trades: trades,
      orders: bot.orders,
      metrics,
    });

  } catch (error) {
    console.error("Error fetching bot performance:", error);
    return new NextResponse(
      "Internal server error",
      { status: 500 }
    );
  }
}
