import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // In a real app, you'd get the user ID from the session
    const userId = req.query.userId as string || 'user-id';

    // Get strategies count
    const strategiesCount = await prisma.strategy.count({
      where: { userId }
    });

    // Get bots counts
    const botsCount = await prisma.bot.count({
      where: { userId }
    });

    const activeBotsCount = await prisma.bot.count({
      where: { userId, status: 'active' }
    });

    // Get portfolio value (just USD for simplicity)
    const usdPortfolios = await prisma.portfolio.findMany({
      where: { userId, currency: 'USD' }
    });
    
    const portfolioValue = usdPortfolios.reduce((sum, portfolio) => sum + portfolio.amount, 0);

    res.status(200).json({
      strategies: strategiesCount,
      bots: botsCount,
      activeBots: activeBotsCount,
      portfolioValue
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
