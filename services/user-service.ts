import { DatabaseService } from './database-service'

interface User {
  _id?: string;
  email: string;
  name: string;
  apiKeys?: {
    alpaca?: {
      keyId: string;
      secretKey: string;
    };
  };
  settings?: {
    tradingEnabled: boolean;
    riskLevel: 'low' | 'medium' | 'high';
    notifications: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export class UserService extends DatabaseService {
  private collection = this.getCollection<User>('users');

  async createUser(userData: Omit<User, 'createdAt' | 'updatedAt'>): Promise<User> {
    const now = new Date();
    const user = {
      ...userData,
      createdAt: now,
      updatedAt: now,
    };
    
    const col = await this.collection;
    const result = await col.insertOne(user);
    return { ...user, _id: result.insertedId.toString() };
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const col = await this.collection;
    return col.findOne({ email });
  }

  async updateUser(email: string, update: Partial<User>): Promise<User | null> {
    const col = await this.collection;
    const result = await col.findOneAndUpdate(
      { email },
      { 
        $set: { 
          ...update,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );
    return result.value;
  }
}