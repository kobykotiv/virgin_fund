import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { AlpacaService } from '../../../services/alpacaService';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // In production, get userId from session
  const userId = req.query.userId as string || 'default-user-id';

  try {
    // Fetch user's API key from database
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        userId,
        platform: 'alpaca',
        isActive: true
      }
    });

    if (!apiKey) {
      return res.status(404).json({ error: 'No active Alpaca API key found' });
    }

    // Get account info using the user's API keys
    const result = await AlpacaService.getAccount(
      apiKey.apiKey,
      apiKey.secretKey,
      req.query.paper === 'true' // Determine if we should use paper trading
    );

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(200).json(result.data);
  } catch (error) {
    console.error('Error fetching Alpaca account:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
