import { Bot, BotStatus, Trade, Order } from "@prisma/client";
import prisma from "@/lib/db/prisma";
import { isDCASettings, isGridSettings, isIndicatorSettings, isBasketSettings } from "@/types/bot";

export class BotManager {
  private bot: Bot;

  constructor(bot: Bot) {
    this.bot = bot;
  }

  // Update bot status and persist to database
  async updateStatus(status: Partial<BotStatus>) {
    const updatedBot = await prisma.bot.update({
      where: { id: this.bot.id },
      data: {
        status: {
          ...this.bot.status,
          ...status,
          lastUpdate: new Date(),
        },
        updatedAt: new Date(),
      },
    });
    this.bot = updatedBot;
    return updatedBot;
  }

  // Record a new trade
  async recordTrade(trade: Omit<Trade, "id" | "botId" | "createdAt" | "updatedAt">) {
    return await prisma.trade.create({
      data: {
        ...trade,
        botId: this.bot.id,
      },
    });
  }

  // Create a new order
  async createOrder(order: Omit<Order, "id" | "botId" | "createdAt" | "updatedAt">) {
    return await prisma.order.create({
      data: {
        ...order,
        botId: this.bot.id,
      },
    });
  }

  // Update order status and record trades
  async updateOrder(
    orderId: string, 
    update: Partial<Order>,
    trade?: Omit<Trade, "id" | "botId" | "orderId" | "createdAt" | "updatedAt">
  ) {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: update,
    });

    if (trade) {
      await this.recordTrade({
        ...trade,
        orderId: order.id,
      });
    }

    return order;
  }

  // Get bot performance metrics
  async getPerformance(timeframe?: { start: Date; end: Date }) {
    const whereClause = {
      botId: this.bot.id,
      ...(timeframe && {
        timestamp: {
          gte: timeframe.start,
          lte: timeframe.end,
        },
      }),
    };

    const trades = await prisma.trade.findMany({
      where: whereClause,
      orderBy: { timestamp: 'asc' },
    });

    const totalTrades = trades.length;
    const profitableTrades = trades.filter(t => (t.profitLoss || 0) > 0).length;
    const totalProfit = trades.reduce((sum, t) => sum + (t.profitLoss || 0), 0);
    const totalFees = trades.reduce((sum, t) => sum + (t.commission || 0), 0);

    return {
      totalTrades,
      winRate: totalTrades > 0 ? (profitableTrades / totalTrades) * 100 : 0,
      totalProfit,
      totalFees,
      netProfit: totalProfit - totalFees,
    };
  }

  // Validate bot settings based on type
  async validateSettings(): Promise<string[]> {
    const errors: string[] = [];
    const settings = this.bot.settings;

    if (isDCASettings(settings)) {
      if (!settings.symbol) errors.push("Symbol is required");
      if (!settings.amount || settings.amount <= 0) errors.push("Amount must be greater than 0");
      if (!settings.interval) errors.push("Interval is required");
    }
    else if (isGridSettings(settings)) {
      if (!settings.symbol) errors.push("Symbol is required");
      if (!settings.upperPrice || settings.upperPrice <= 0) errors.push("Upper price must be greater than 0");
      if (!settings.lowerPrice || settings.lowerPrice <= 0) errors.push("Lower price must be greater than 0");
      if (settings.upperPrice <= settings.lowerPrice) errors.push("Upper price must be greater than lower price");
      if (!settings.gridLines || settings.gridLines < 2) errors.push("At least 2 grid lines required");
      if (!settings.investmentAmount || settings.investmentAmount <= 0) errors.push("Investment amount must be greater than 0");
    }
    else if (isIndicatorSettings(settings)) {
      if (!settings.symbol) errors.push("Symbol is required");
      if (!settings.timeframe) errors.push("Timeframe is required");
      if (!settings.entryAmount || settings.entryAmount <= 0) errors.push("Entry amount must be greater than 0");
      
      // Validate indicators based on strategy
      if (settings.indicators.rsi) {
        if (!settings.indicators.rsi.period) errors.push("RSI period is required");
        if (!settings.indicators.rsi.overbought) errors.push("RSI overbought level is required");
        if (!settings.indicators.rsi.oversold) errors.push("RSI oversold level is required");
      }
    }
    else if (isBasketSettings(settings)) {
      if (!settings.assets || settings.assets.length < 2) errors.push("At least 2 assets required");
      if (!settings.rebalanceThreshold) errors.push("Rebalance threshold is required");
      if (!settings.rebalanceInterval) errors.push("Rebalance interval is required");
      if (!settings.totalAmount || settings.totalAmount <= 0) errors.push("Total amount must be greater than 0");
      
      const totalWeight = settings.assets.reduce((sum, asset) => sum + asset.weight, 0);
      if (Math.abs(totalWeight - 100) > 0.01) errors.push("Asset weights must sum to 100%");
    }

    return errors;
  }

  // Get open orders
  async getOpenOrders() {
    return await prisma.order.findMany({
      where: {
        botId: this.bot.id,
        status: {
          in: ['new', 'partial']
        }
      },
      include: {
        trades: true
      }
    });
  }

  // Get recent trades
  async getRecentTrades(limit = 10) {
    return await prisma.trade.findMany({
      where: {
        botId: this.bot.id
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: limit
    });
  }
}

// Factory function to create BotManager instance
export async function createBotManager(botId: string): Promise<BotManager> {
  const bot = await prisma.bot.findUnique({
    where: { id: botId },
  });

  if (!bot) {
    throw new Error(`Bot with ID ${botId} not found`);
  }

  return new BotManager(bot);
}
