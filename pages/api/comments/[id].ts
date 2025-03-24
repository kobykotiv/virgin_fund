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
  const commentId = req.query.id as string;

  // Get the comment
  const comment = await prisma.comment.findUnique({
    where: { id: commentId }
  });

  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  switch (req.method) {
    case 'DELETE':
      // Only the comment author can delete their comment
      if (comment.userId !== userId) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      
      try {
        await prisma.comment.delete({
          where: { id: commentId }
        });
        
        return res.status(204).end();
      } catch (error) {
        console.error('Error deleting comment:', error);
        return res.status(500).json({ error: 'Failed to delete comment' });
      }
      
    default:
      res.setHeader('Allow', ['DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
