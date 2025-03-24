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

    // Get API keys count
    const apiKeysCount = await prisma.apiKey.count({
      where: { userId }
    });

    // Get feedback count
    const feedbackCount = await prisma.feedback.count({
      where: { userId }
    });

    // Get portfolios with currency breakdown
    const portfolios = await prisma.portfolio.findMany({
      where: { userId }
    });
    
    // Calculate portfolio value (just USD for simplicity)
    const usdPortfolios = portfolios.filter(p => p.currency === 'USD');
    const portfolioValue = usdPortfolios.reduce((sum, portfolio) => sum + portfolio.amount, 0);

    // Group portfolios by currency for the UI
    const currencies = [];
    const currencyGroups = {};
    
    portfolios.forEach(portfolio => {
      if (!currencyGroups[portfolio.currency]) {
        currencyGroups[portfolio.currency] = {
          code: portfolio.currency,
          name: getCurrencyName(portfolio.currency),
          amount: 0,
          usdValue: 0 // In a real app, you'd convert to USD based on exchange rates
        };
      }
      
      currencyGroups[portfolio.currency].amount += portfolio.amount;
      
      // Simple conversion for demo purposes
      if (portfolio.currency === 'USD') {
        currencyGroups[portfolio.currency].usdValue += portfolio.amount;
      } else if (portfolio.currency === 'EUR') {
        currencyGroups[portfolio.currency].usdValue += portfolio.amount * 1.1; // Example rate
      } else if (portfolio.currency === 'BTC') {
        currencyGroups[portfolio.currency].usdValue += portfolio.amount * 35000; // Example rate
      } else {
        currencyGroups[portfolio.currency].usdValue += portfolio.amount; // Fallback
      }
    });
    
    for (const currency in currencyGroups) {
      currencies.push(currencyGroups[currency]);
    }

    res.status(200).json({
      strategies: strategiesCount,
      bots: botsCount,
      activeBots: activeBotsCount,
      apiKeys: apiKeysCount,
      feedback: feedbackCount,
      portfolioValue,
      currencies
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Helper function to get currency names
function getCurrencyName(code) {
  const currencies = {
    USD: 'US Dollar',
    EUR: 'Euro',
    GBP: 'British Pound',
    BTC: 'Bitcoin',
    ETH: 'Ethereum'
  };
  
  return currencies[code] || code;
}
