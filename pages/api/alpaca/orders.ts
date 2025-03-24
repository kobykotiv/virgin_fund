import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { AlpacaService } from '../../../services/alpacaService';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // In production, get userId from session
  const userId = req.query.userId as string || 'default-user-id';

  try {
    // Fetch user's API key from database
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        userId,
        platform: 'alpaca',
        isActive: true
      }
    });

    if (!apiKey) {
      return res.status(404).json({ error: 'No active Alpaca API key found' });
    }
    
    const isPaper = req.query.paper === 'true';

    // Create an order
    if (req.method === 'POST') {
      const { symbol, qty, side, type, time_in_force, limit_price, stop_price } = req.body;
      
      if (!symbol || !qty || !side || !type || !time_in_force) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }
      
      const result = await AlpacaService.createOrder(
        {
          symbol,
          qty,
          side,
          type,
          time_in_force,
          ...(limit_price && { limit_price }),
          ...(stop_price && { stop_price })
        },
        apiKey.apiKey,
        apiKey.secretKey,
        isPaper
      );

      if (result.error) {
        return res.status(400).json({ error: result.error });
      }

      // Save order to our database for tracking
      await prisma.tradeOrder.create({
        data: {
          userId,
          orderId: result.data.id,
          symbol,
          quantity: qty,
          side,
          type,
          status: result.data.status,
          createdAt: new Date(result.data.created_at),
          alpacaOrderData: result.data
        }
      });

      return res.status(201).json(result.data);
    }
    
    // Get orders
    if (req.method === 'GET') {
      const orderId = req.query.orderId as string;
      
      // Get a specific order
      if (orderId) {
        const result = await AlpacaService.getOrder(
          orderId,
          apiKey.apiKey,
          apiKey.secretKey,
          isPaper
        );

        if (result.error) {
          return res.status(400).json({ error: result.error });
        }

        return res.status(200).json(result.data);
      }
      
      // Get all orders with optional filters
      const status = req.query.status as 'open' | 'closed' | 'all' | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const after = req.query.after ? new Date(req.query.after as string) : undefined;
      const until = req.query.until ? new Date(req.query.until as string) : undefined;
      
      const result = await AlpacaService.getOrders(
        status,
        limit,
        after,
        until,
        apiKey.apiKey,
        apiKey.secretKey,
        isPaper
      );

      if (result.error) {
        return res.status(400).json({ error: result.error });
      }

      return res.status(200).json(result.data);
    }
    
    // Cancel an order
    if (req.method === 'DELETE') {
      const orderId = req.query.orderId as string;
      
      if (!orderId) {
        return res.status(400).json({ error: 'Order ID is required' });
      }
      
      const result = await AlpacaService.cancelOrder(
        orderId,
        apiKey.apiKey,
        apiKey.secretKey,
        isPaper
      );

      if (result.error) {
        return res.status(400).json({ error: result.error });
      }
      
      // Update our database
      await prisma.tradeOrder.updateMany({
        where: { orderId },
        data: { status: 'CANCELED' }
      });

      return res.status(200).json({ message: 'Order canceled successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error handling Alpaca orders:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
