export interface User {
  id: string;
  email: string;
  name: string;
  apiConnections: ApiConnection[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiConnection {
  id: string;
  userId: string;
  name: string;
  provider: 'alpaca';
  credentials: {
    apiKey: string;
    secretKey: string;
    passphrase?: string;
    additionalKeys?: Record<string, string>;
  };
  permissions: {
    canRead: boolean;
    canTrade: boolean;
    canWithdraw: boolean;
  };
  rateLimit: {
    requestsPerMinute: number;
    requestsPerHour: number;
  };
  status: 'active' | 'inactive' | 'error';
  lastChecked: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  description?: string;
  accountType: 'standard' | 'margin' | 'retirement' | 'managed';
  strategy: 'passive' | 'active' | 'automated' | 'copy';
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  assets: PortfolioAsset[];
  isPublic: boolean;
  sharing: {
    isPublic: boolean;
    allowCopy: boolean;
    socialLinks?: {
      twitter?: string;
      telegram?: string;
      discord?: string;
    };
  };
  bots: {
    botId: string;
    status: 'active' | 'paused';
    permissions: ('read' | 'trade')[];
  }[];
  metadata: {
    leverage?: number;
    marginRequirement?: number;
    automationRules?: AutomationRule[];
    copySettings?: CopyTradeSettings;
  };
  performance?: {
    totalPnL: number;
    dailyPnL: number;
    weeklyPnL: number;
    monthlyPnL: number;
    lastUpdated: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface PortfolioAsset {
  id: string;
  portfolioId: string;
  symbol: string;
  quantity: number;
  averagePrice: number;
  holdingType: 'long' | 'short' | 'option' | 'future';
  metadata: {
    stopLoss?: number;
    takeProfit?: number;
    leverageRatio?: number;
  };
  automatedHolding?: AutomatedHolding;
  transactions: Transaction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AutomatedHolding {
  type: 'dca' | 'grid' | 'martingale' | 'rebalancing';
  parameters: {
    interval?: string;
    amount?: number;
    gridLevels?: number;
    rebalanceThreshold?: number;
    maxDrawdown?: number;
  };
  automationRules: AutomationRule[];
}

export interface Transaction {
  id: string;
  assetId: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}
