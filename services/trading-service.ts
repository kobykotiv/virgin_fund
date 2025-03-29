import { DatabaseService } from './database-service'

interface Order {
  _id?: string;
  userId: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop' | 'stop_limit';
  quantity: number;
  price?: number;
  stopPrice?: number;
  status: 'pending' | 'filled' | 'cancelled' | 'rejected';
  filledAt?: Date;
  filledPrice?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Trade {
  _id?: string;
  userId: string;
  orderId: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: Date;
  commission: number;
  totalValue: number;
}

export class TradingService extends DatabaseService {
  private ordersCollection = this.getCollection<Order>('orders');
  private tradesCollection = this.getCollection<Trade>('trades');

  async createOrder(orderData: Omit<Order, '_id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const now = new Date();
    const order = {
      ...orderData,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };
    
    const col = await this.ordersCollection;
    const result = await col.insertOne(order);
    return { ...order, _id: result.insertedId.toString() };
  }

  async updateOrderStatus(orderId: string, status: Order['status'], fillDetails?: { price: number }): Promise<Order | null> {
    const now = new Date();
    const col = await this.ordersCollection;
    const result = await col.findOneAndUpdate(
      { _id: orderId },
      { 
        $set: { 
          status,
          ...(fillDetails && {
            filledPrice: fillDetails.price,
            filledAt: now
          }),
          updatedAt: now
        }
      },
      { returnDocument: 'after' }
    );
    return result.value;
  }

  async recordTrade(tradeData: Omit<Trade, '_id'>): Promise<Trade> {
    const col = await this.tradesCollection;
    const result = await col.insertOne(tradeData);
    return { ...tradeData, _id: result.insertedId.toString() };
  }

  async getUserOrders(userId: string, status?: Order['status']): Promise<Order[]> {
    const col = await this.ordersCollection;
    const query = status ? { userId, status } : { userId };
    return col.find(query).sort({ createdAt: -1 }).toArray();
  }

  async getUserTrades(userId: string, symbol?: string): Promise<Trade[]> {
    const col = await this.tradesCollection;
    const query = symbol ? { userId, symbol } : { userId };
    return col.find(query).sort({ timestamp: -1 }).toArray();
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    const col = await this.ordersCollection;
    return col.findOne({ _id: orderId });
  }
}