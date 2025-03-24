import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // In production, get userId from session
  const userId = req.query.userId as string || 'default-user-id';

  try {
    // Check if user has an active Alpaca API key
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        userId,
        platform: 'alpaca',
        isActive: true
      }
    });

    return res.status(200).json({ hasKey: !!apiKey });
  } catch (error) {
    console.error('Error checking for Alpaca API keys:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
