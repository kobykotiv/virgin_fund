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
        // Parse query parameters
        const { limit = '10', cursor, portfolioId, following } = req.query;
        const limitNum = parseInt(limit as string, 10);
        
        let where: any = {};
        
        // Filter by portfolio if specified
        if (portfolioId) {
          where.portfolioId = portfolioId as string;
        }
        
        // Filter by followed users if specified
        if (following === 'true') {
          const followedUsers = await prisma.follow.findMany({
            where: {
              followerId: userId,
              status: 'ACTIVE'
            },
            select: { providerId: true }
          });
          
          where.userId = {
            in: followedUsers.map(f => f.providerId)
          };
        }
        
        // Add cursor-based pagination
        if (cursor) {
          where.id = {
            lt: cursor as string
          };
        }
        
        // Get shared positions with pagination
        const sharedPositions = await prisma.sharedPosition.findMany({
          where,
          take: limitNum + 1, // Take one extra to check if there are more results
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileImage: true
              }
            },
            _count: {
              select: { comments: true }
            }
          }
        });
        
        // Check if there are more results
        const hasMore = sharedPositions.length > limitNum;
        if (hasMore) {
          sharedPositions.pop(); // Remove the extra item
        }
        
        // Get next cursor
        const nextCursor = hasMore ? sharedPositions[sharedPositions.length - 1].id : null;
        
        return res.status(200).json({
          sharedPositions,
          hasMore,
          nextCursor
        });
      } catch (error) {
        console.error('Error fetching shared positions:', error);
        return res.status(500).json({ error: 'Failed to fetch shared positions' });
      }
      
    case 'POST':
      try {
        const { portfolioId, positionId, symbol, entryPrice, direction, reasoning } = req.body;
        
        // Create shared position
        const sharedPosition = await prisma.sharedPosition.create({
          data: {
            portfolioId,
            positionId: positionId || null,
            userId,
            symbol: symbol.toUpperCase(),
            entryPrice: parseFloat(entryPrice),
            direction: direction as Direction,
            reasoning,
          }
        });
        
        return res.status(201).json(sharedPosition);
      } catch (error) {
        console.error('Error sharing position:', error);
        return res.status(500).json({ error: 'Failed to share position' });
      }
      
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
