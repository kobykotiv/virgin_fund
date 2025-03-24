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
  const portfolioId = req.query.id as string;

  // Validate portfolio exists
  const portfolio = await prisma.portfolio.findUnique({
    where: { id: portfolioId }
  });

  if (!portfolio) {
    return res.status(404).json({ error: 'Portfolio not found' });
  }

  // Authorization check: Only owner can manage their portfolio
  if (portfolio.userId !== userId) {
    // Allow read access if portfolio is public
    if (req.method !== 'GET' || !portfolio.isPublic) {
      return res.status(403).json({ error: 'Forbidden' });
    }
  }

  switch (req.method) {
    case 'GET':
      try {
        const portfolioDetails = await prisma.portfolio.findUnique({
          where: { id: portfolioId },
          include: {
            positions: {
              orderBy: { openedAt: 'desc' }
            }
          }
        });
        
        return res.status(200).json(portfolioDetails);
      } catch (error) {
        console.error('Error fetching portfolio details:', error);
        return res.status(500).json({ error: 'Failed to fetch portfolio details' });
      }
      
    case 'PUT':
      try {
        const { name, description, isPublic } = req.body;
        
        // Update portfolio
        const updatedPortfolio = await prisma.portfolio.update({
          where: { id: portfolioId },
          data: {
            name,
            description,
            isPublic,
            updatedAt: new Date()
          }
        });
        
        return res.status(200).json(updatedPortfolio);
      } catch (error) {
        console.error('Error updating portfolio:', error);
        return res.status(500).json({ error: 'Failed to update portfolio' });
      }
      
    case 'DELETE':
      try {
        // Delete all related positions first
        await prisma.position.deleteMany({
          where: { portfolioId }
        });
        
        // Delete all related shared positions
        await prisma.sharedPosition.deleteMany({
          where: { portfolioId }
        });
        
        // Delete the portfolio
        await prisma.portfolio.delete({
          where: { id: portfolioId }
        });
        
        return res.status(204).end();
      } catch (error) {
        console.error('Error deleting portfolio:', error);
        return res.status(500).json({ error: 'Failed to delete portfolio' });
      }
      
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
