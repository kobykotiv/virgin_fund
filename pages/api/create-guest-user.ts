import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const guestUser = await prisma.user.create({
      data: {
        email: `guest-${Date.now()}@example.com`,
        name: 'Guest User',
        isGuest: true,
        portfolios: {
          create: [
            { currency: 'USD', amount: 100000 },
            { currency: 'EUR', amount: 50000 },
            { currency: 'BTC', amount: 1 },
          ],
        },
      },
    });

    res.status(201).json({ user: guestUser });
  } catch (error) {
    console.error('Error creating guest user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
