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
  const positionId = req.query.id as string;

  // Get position with its portfolio to check ownership
  const position = await prisma.position.findUnique({
    where: { id: positionId },
    include: {
      portfolio: {
        select: {
          userId: true
        }
      }
    }
  });

  if (!position) {
    return res.status(404).json({ error: 'Position not found' });
  }

  // Authorization check
  if (position.portfolio.userId !== userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  switch (req.method) {
    case 'GET':
      try {
        return res.status(200).json(position);
      } catch (error) {
        console.error('Error fetching position:', error);
        return res.status(500).json({ error: 'Failed to fetch position' });
      }
      
    case 'PUT':
      try {
        const { entryPrice, quantity, pnl, closedAt } = req.body;
        
        // Update position
        const updatedPosition = await prisma.position.update({
          where: { id: positionId },
          data: {
            ...(entryPrice && { entryPrice: parseFloat(entryPrice) }),
            ...(quantity && { quantity: parseFloat(quantity) }),
            ...(pnl !== undefined && { pnl: parseFloat(pnl) }),
            ...(closedAt && { closedAt: new Date(closedAt) })
          }
        });
        
        return res.status(200).json(updatedPosition);
      } catch (error) {
        console.error('Error updating position:', error);
        return res.status(500).json({ error: 'Failed to update position' });
      }
      
    case 'DELETE':
      try {
        await prisma.position.delete({
          where: { id: positionId }
        });
        
        return res.status(204).end();
      } catch (error) {
        console.error('Error deleting position:', error);
        return res.status(500).json({ error: 'Failed to delete position' });
      }
      
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
