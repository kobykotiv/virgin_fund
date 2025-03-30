import { Asset } from './Asset';

export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  type: 'standard' | 'margin';
  risk: 'conservative' | 'moderate' | 'aggressive'; 
  assets: Asset[];
  createdAt: Date;
  updatedAt: Date;
}

export class PortfolioManager {
  create(userId: string, name: string, type: 'standard' | 'margin', risk: 'conservative' | 'moderate' | 'aggressive'): Portfolio {
    return {
      id: crypto.randomUUID(),
      userId,
      name,
      type,
      risk,
      assets: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  update(portfolio: Portfolio, updates: Partial<Portfolio>): Portfolio {
    return {
      ...portfolio,
      ...updates,
      updatedAt: new Date()
    };
  }
}
