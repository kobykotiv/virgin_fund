export interface Transaction {
  id: string;
  portfolioId: string;
  assetId: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: Date;
}

export class TransactionManager {
  create(portfolioId: string, assetId: string, type: 'buy' | 'sell', quantity: number, price: number): Transaction {
    return {
      id: crypto.randomUUID(),
      portfolioId,
      assetId,
      type,
      quantity,
      price,
      timestamp: new Date()
    };
  }
}
