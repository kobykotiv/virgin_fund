import type { NextApiRequest, NextApiResponse } from 'next';
import {
  getAccount,
  getPositions,
  getOrders,
  getOrderById,
  cancelOrder,
  getAssets,
  getMarketClock,
  getCalendar,
  placeOrder,
} from '../../../server/alpaca';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { operation } = req.query;
  const { apiKey, apiSecret, ...params } = req.body;

  try {
    let result;
    switch (operation) {
      case 'account':
        result = await getAccount({ apiKey, apiSecret });
        break;
      case 'positions':
        result = await getPositions({ apiKey, apiSecret });
        break;
      case 'orders':
        result = await getOrders({ apiKey, apiSecret, ...params });
        break;
      case 'orderById':
        result = await getOrderById({ apiKey, apiSecret, orderId: params.orderId });
        break;
      case 'cancelOrder':
        result = await cancelOrder({ apiKey, apiSecret, orderId: params.orderId });
        break;
      case 'assets':
        result = await getAssets({ apiKey, apiSecret, ...params });
        break;
      case 'clock':
        result = await getMarketClock({ apiKey, apiSecret });
        break;
      case 'calendar':
        result = await getCalendar({ apiKey, apiSecret, start: params.start, end: params.end });
        break;
      case 'placeOrder':
        result = await placeOrder({ apiKey, apiSecret, ...params });
        break;
      default:
        return res.status(400).json({ error: 'Invalid operation' });
    }
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
