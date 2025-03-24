import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Direction } from '@prisma/client';
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
        const { portfolioId } = req.query;
        
        if (!portfolioId) {
          return res.status(400).json({ error: 'Portfolio ID is required' });
        }
        
        // Validate portfolio exists and belongs to user
        const portfolio = await prisma.portfolio.findFirst({
          where: {
            id: portfolioId as string,
            userId
          }
        });
        
        if (!portfolio) {
          return res.status(404).json({ error: 'Portfolio not found' });
        }
        
        // Get positions
        const positions = await prisma.position.findMany({
          where: { portfolioId: portfolioId as string },
          orderBy: { openedAt: 'desc' }
        });
        
        return res.status(200).json(positions);
      } catch (error) {
        console.error('Error fetching positions:', error);
        return res.status(500).json({ error: 'Failed to fetch positions' });
      }
      
    case 'POST':
      try {
        const { portfolioId, symbol, entryPrice, quantity, direction } = req.body;
        
        if (!portfolioId || !symbol || !entryPrice || !quantity || !direction) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Validate portfolio exists and belongs to user
        const portfolio = await prisma.portfolio.findFirst({
          where: {
            id: portfolioId,
            userId
          }
        });
        
        if (!portfolio) {
          return res.status(404).json({ error: 'Portfolio not found' });
        }
        
        // Create position
        const position = await prisma.position.create({
          data: {
            portfolioId,
            symbol: symbol.toUpperCase(),
            entryPrice: parseFloat(entryPrice),
            quantity: parseFloat(quantity),
            direction: direction as Direction,
            openedAt: new Date()
          }
        });
        
        return res.status(201).json(position);
      } catch (error) {
        console.error('Error creating position:', error);
        return res.status(500).json({ error: 'Failed to create position' });
      }
      
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
