import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = session.user.id;

  switch (req.method) {
    case 'GET':
      try {
        // Get user's portfolios
        const portfolios = await prisma.portfolio.findMany({
          where: { userId },
          include: {
            _count: {
              select: { positions: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        });
        
        return res.status(200).json(portfolios);
      } catch (error) {
        console.error('Error fetching portfolios:', error);
        return res.status(500).json({ error: 'Failed to fetch portfolios' });
      }
      
    case 'POST':
      try {
        const { name, description, isPublic } = req.body;
        
        // Create new portfolio
        const portfolio = await prisma.portfolio.create({
          data: {
            userId,
            name,
            description: description || null,
            isPublic: isPublic || false
          }
        });
        
        return res.status(201).json(portfolio);
      } catch (error) {
        console.error('Error creating portfolio:', error);
        return res.status(500).json({ error: 'Failed to create portfolio' });
      }
      
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
