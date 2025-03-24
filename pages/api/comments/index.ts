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
    case 'POST':
      try {
        const { sharedPositionId, content } = req.body;
        
        if (!sharedPositionId || !content) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Verify the shared position exists
        const sharedPosition = await prisma.sharedPosition.findUnique({
          where: { id: sharedPositionId }
        });
        
        if (!sharedPosition) {
          return res.status(404).json({ error: 'Shared position not found' });
        }
        
        // Create comment
        const comment = await prisma.comment.create({
          data: {
            sharedPositionId,
            userId,
            content
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileImage: true
              }
            }
          }
        });
        
        return res.status(201).json(comment);
      } catch (error) {
        console.error('Error creating comment:', error);
        return res.status(500).json({ error: 'Failed to create comment' });
      }
      
    default:
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
