import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { AlpacaService } from '../../../services/alpacaService';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
    
    const isPaper = req.query.paper === 'true';

    // Get positions
    if (req.method === 'GET') {
      const symbol = req.query.symbol as string;
      
      // Get a specific position
      if (symbol) {
        const result = await AlpacaService.getPosition(
          symbol,
          apiKey.apiKey,
          apiKey.secretKey,
          isPaper
        );

        if (result.error) {
          return res.status(400).json({ error: result.error });
        }

        return res.status(200).json(result.data);
      }
      
      // Get all positions
      const result = await AlpacaService.getPositions(
        apiKey.apiKey,
        apiKey.secretKey,
        isPaper
      );

      if (result.error) {
        return res.status(400).json({ error: result.error });
      }

      return res.status(200).json(result.data);
    }
    
    // Close positions
    if (req.method === 'DELETE') {
      const symbol = req.query.symbol as string;
      
      // Close all positions
      if (req.query.all === 'true') {
        const result = await AlpacaService.closeAllPositions(
          apiKey.apiKey,
          apiKey.secretKey,
          isPaper
        );

        if (result.error) {
          return res.status(400).json({ error: result.error });
        }

        return res.status(200).json({ message: 'All positions closed successfully' });
      }
      
      // Close a specific position
      if (!symbol) {
        return res.status(400).json({ error: 'Symbol is required for closing a position' });
      }
      
      const result = await AlpacaService.closePosition(
        symbol,
        apiKey.apiKey,
        apiKey.secretKey,
        isPaper
      );

      if (result.error) {
        return res.status(400).json({ error: result.error });
      }

      return res.status(200).json({ message: `Position for ${symbol} closed successfully` });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error handling Alpaca positions:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
