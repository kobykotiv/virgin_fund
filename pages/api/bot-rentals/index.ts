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
        const { filter, botId } = req.query;
        
        // Define query conditions
        let where: any = {};
        
        // Filter by bot ID if provided
        if (botId) {
          where.botId = botId as string;
        }
        
        // Filter by status if provided
        if (filter) {
          where.status = filter as string;
        }
        
        // For providers: get rentals of their bots
        // For renters: get rentals they've made
        if (req.query.view === 'provider') {
          // Get bots owned by user
          const userBots = await prisma.bot.findMany({
            where: { userId },
            select: { id: true }
          });
          
          where.botId = { in: userBots.map(bot => bot.id) };
        } else {
          // Default: view as renter
          where.renterId = userId;
        }
        
        const rentals = await prisma.botRental.findMany({
          where,
          include: {
            bot: {
              select: {
                id: true,
                name: true,
                type: true,
                user: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        });
        
        return res.status(200).json(rentals);
      } catch (error) {
        console.error('Error fetching rentals:', error);
        return res.status(500).json({ error: 'Failed to fetch rentals' });
      }
      
    case 'POST':
      try {
        const { botId, startTime, endTime, settings } = req.body;
        
        // Verify the bot exists and is available for rent
        const bot = await prisma.bot.findUnique({
          where: { id: botId }
        });
        
        if (!bot) {
          return res.status(404).json({ error: 'Bot not found' });
        }
        
        if (!bot.rentalPrice) {
          return res.status(400).json({ error: 'This bot is not available for rent' });
        }
        
        // Calculate rental cost
        const start = new Date(startTime);
        const end = new Date(endTime);
        const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        const totalCost = durationHours * bot.rentalPrice;
        
        // Create the rental
        const rental = await prisma.botRental.create({
          data: {
            botId,
            renterId: userId,
            startTime: start,
            endTime: end,
            totalCost,
            settings: settings || {},
            status: 'PENDING'
          }
        });
        
        return res.status(201).json(rental);
      } catch (error) {
        console.error('Error creating rental:', error);
        return res.status(500).json({ error: 'Failed to create rental' });
      }
      
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
