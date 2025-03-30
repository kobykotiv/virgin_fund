export interface Asset {
  id: string;
  portfolioId: string;
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice?: number;
  lastUpdated?: Date;
}

export class AssetManager {
  create(portfolioId: string, symbol: string, quantity: number, price: number): Asset {
    return {
      id: crypto.randomUUID(),
      portfolioId,
      symbol,
      quantity,
      averagePrice: price,
      currentPrice: price,
      lastUpdated: new Date()
    };
  }
  
  updatePrice(asset: Asset, price: number): Asset {
    return {
      ...asset,
      currentPrice: price,
      lastUpdated: new Date()
    };
  }
}
