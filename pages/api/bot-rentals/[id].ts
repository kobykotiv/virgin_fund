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
  const rentalId = req.query.id as string;

  // Validate rental ID
  const rental = await prisma.botRental.findUnique({
    where: { id: rentalId },
    include: {
      bot: {
        select: {
          userId: true
        }
      }
    }
  });

  if (!rental) {
    return res.status(404).json({ error: 'Rental not found' });
  }

  // Authorization: Only the renter or bot owner can access this rental
  if (rental.renterId !== userId && rental.bot.userId !== userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const rentalDetails = await prisma.botRental.findUnique({
          where: { id: rentalId },
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
            },
            renter: {
              select: {
                id: true,
                name: true
              }
            }
          }
        });
        
        return res.status(200).json(rentalDetails);
      } catch (error) {
        console.error('Error fetching rental details:', error);
        return res.status(500).json({ error: 'Failed to fetch rental details' });
      }
      
    case 'PUT':
      try {
        const { status, settings } = req.body;
        
        // Validate status transition
        if (status) {
          // Add business logic for valid status transitions here
          // For example, PENDING can go to ACTIVE or CANCELLED, but COMPLETED cannot be changed
        }
        
        // Update the rental
        const updatedRental = await prisma.botRental.update({
          where: { id: rentalId },
          data: {
            ...(status && { status }),
            ...(settings && { settings }),
            updatedAt: new Date()
          }
        });
        
        return res.status(200).json(updatedRental);
      } catch (error) {
        console.error('Error updating rental:', error);
        return res.status(500).json({ error: 'Failed to update rental' });
      }
      
    case 'DELETE':
      try {
        // Only allow deletion of PENDING rentals
        if (rental.status !== 'PENDING') {
          return res.status(400).json({ 
            error: 'Only pending rentals can be deleted' 
          });
        }
        
        // Delete the rental
        await prisma.botRental.delete({
          where: { id: rentalId }
        });
        
        return res.status(204).end();
      } catch (error) {
        console.error('Error deleting rental:', error);
        return res.status(500).json({ error: 'Failed to delete rental' });
      }
      
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
