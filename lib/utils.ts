import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertBotToDemoBot(bot: Bot): DemoBot {
  const allocation: Record<string, number> = {};
  if (bot.type === "basket" && bot.basketConfig?.targetAllocation) {
    Object.entries(bot.basketConfig.targetAllocation).forEach(([symbol, weight]) => {
      allocation[symbol] = weight * 100;
    });
  }
  return {
    id: bot.id,
    nickname: bot.name,
    costBasis: bot.allocation || 25000,
    positions: bot.assets.map((symbol) => ({
      symbol,
      quantity: 50,
      avgPrice: 100,
      currentPrice: 110,
      costBasis: 5000,
      marketValue: 5500,
      unrealizedPnL: 500,
    })),
    assets: bot.assets,
    margin: 0.3,
    performance: [100, 102, 105, 103, 106, 108, 110],
    allocation,
    strategy: bot.type,
    stopLoss: bot.stopLoss,
    takeProfit: bot.takeProfit,
    maxDrawdown: bot.maxDrawdown,
    strategyConfig: bot.indicatorConfig || bot.gridConfig || bot.dcaConfig || bot.basketConfig,
  };
}

