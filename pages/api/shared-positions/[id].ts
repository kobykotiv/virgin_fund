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
  const sharedPositionId = req.query.id as string;

  // Get the shared position
  const sharedPosition = await prisma.sharedPosition.findUnique({
    where: { id: sharedPositionId }
  });

  if (!sharedPosition) {
    return res.status(404).json({ error: 'Shared position not found' });
  }

  switch (req.method) {
    case 'GET':
      try {
        // Get detailed shared position with user and comments
        const detailedPosition = await prisma.sharedPosition.findUnique({
          where: { id: sharedPositionId },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileImage: true
              }
            },
            comments: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    profileImage: true
                  }
                }
              },
              orderBy: { createdAt: 'asc' }
            }
          }
        });
        
        return res.status(200).json(detailedPosition);
      } catch (error) {
        console.error('Error fetching shared position details:', error);
        return res.status(500).json({ error: 'Failed to fetch shared position details' });
      }
      
    case 'DELETE':
      // Only the creator can delete their shared position
      if (sharedPosition.userId !== userId) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      
      try {
        // Delete all comments first
        await prisma.comment.deleteMany({
          where: { sharedPositionId }
        });
        
        // Delete the shared position
        await prisma.sharedPosition.delete({
          where: { id: sharedPositionId }
        });
        
        return res.status(204).end();
      } catch (error) {
        console.error('Error deleting shared position:', error);
        return res.status(500).json({ error: 'Failed to delete shared position' });
      }
      
    case 'PUT':
      // Handle "like" action
      if (req.body.action === 'like') {
        try {
          const updatedPosition = await prisma.sharedPosition.update({
            where: { id: sharedPositionId },
            data: {
              likes: { increment: 1 }
            }
          });
          
          return res.status(200).json(updatedPosition);
        } catch (error) {
          console.error('Error liking shared position:', error);
          return res.status(500).json({ error: 'Failed to like shared position' });
        }
      }
      
      return res.status(400).json({ error: 'Invalid action' });
      
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
