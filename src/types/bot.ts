export type TradingFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly';

export interface TradingPair {
  base: string;
  quote: string;
}

type StrategyType = 'momentum' | 'meanReversion' | 'trend' | 'grid' | 'dca';

interface MomentumParams {
  period: number;
  threshold: number;
}

interface GridParams {
  levels: number;
  spacing: number;
}

// Add other strategy param interfaces as needed

type StrategyParams = {
  momentum: MomentumParams;
  grid: GridParams;
  // Add other strategy types
  [key: string]: Record<string, any>; // Fallback for other strategies
};

export interface RiskManagementSettings {
  stopLoss: number;
  takeProfit: number;
  maxDrawdown?: number;
}

export interface SubscriptionPlan {
  tier: "Starter" | "Basic" | "Advanced" | "Professional" | "Enterprise";
  maxBots: number; // Maximum number of bots allowed
  maxCustomSignals: number; // Maximum custom signals allowed
  backtestingLimit: "3 months" | "6 months" | "12 months" | "unlimited";
  marketSignalsAccess: "basic" | "premium" | "full";
  webhookSupport: boolean;
  apiAccess: boolean;
  whiteLabeling: boolean;
  dedicatedSupport: boolean;
}

export interface BotConfig {
  id?: string;
  name: string;
  description?: string;
  type: BotType;
  assets?: {
    symbol: string;
    allocation: number;
  }[];
  strategy?: {
    type: "momentum" | "meanReversion" | "trend";
    indicators?: {
      name: string;
      period: number;
      parameters: Record<string, any>;
    }[];
  };
  riskManagement: {
    stopLoss: {
      type: "fixed" | "trailing" | "atr";
      value: number;
      atrMultiplier?: number;
      trailingOffset?: number;
    };
    takeProfit: {
      type: "fixed" | "scaled";
      targets: {
        price: number;
        quantity: number;
      }[];
    };
    positionSizing: {
      type: "fixed" | "risk_based" | "kelly_criterion";
      value: number;
      maxPositionSize: number;
      maxAllocation: number;
    };
    riskPerTrade: number;
    maxDrawdown: number;
    maxOpenPositions: number;
    maxDailyLoss: number;
  };
  deployment?: {
    maxCapitalPercentage: number;
    executionType: "market" | "limit";
    fractionalTrading: boolean;
    marginTrading: boolean;
    notifications: {
      trades: boolean;
      errors: boolean;
      performance: boolean;
    };
  };
  subscriptionPlan?: SubscriptionPlan; // New property for subscription plan
}

export interface WizardStep {
  title: string;
  description: string;
  isValid: boolean;
}
