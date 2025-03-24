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

    const status = req.query.status as 'active' | 'inactive' | undefined;
    const assetClass = req.query.assetClass as 'us_equity' | 'crypto' | undefined;

    // If a symbol is provided, get a specific asset
    if (req.query.symbol) {
      const result = await AlpacaService.getAsset(
        req.query.symbol as string,
        apiKey.apiKey,
        apiKey.secretKey,
        req.query.paper === 'true'
      );

      if (result.error) {
        return res.status(400).json({ error: result.error });
      }

      return res.status(200).json(result.data);
    }

    // Otherwise, get all assets with optional filters
    const result = await AlpacaService.getAssets(
      status,
      assetClass,
      apiKey.apiKey,
      apiKey.secretKey,
      req.query.paper === 'true'
    );

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(200).json(result.data);
  } catch (error) {
    console.error('Error fetching Alpaca assets:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
