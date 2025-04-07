export interface BacktestParams {
  startDate: string;
  endDate: string;
  initialCapital: number;
  symbol: string;
  interval: string;
  botConfig: {
    type: BotType;
    stopLoss?: number;
    takeProfit?: number;
    maxDrawdown?: number;
    indicatorConfig?: IndicatorConfig;
    gridConfig?: GridConfig;
    dcaConfig?: DCAConfig;
    basketConfig?: BasketConfig;
  };
  executionParams?: {
    slippage?: number;
    commission?: number;
    delay?: number;
  };
}

export interface BacktestResult {
  summary: {
    totalReturn: number;
    maxDrawdown: number;
    sharpeRatio: number;
    trades: number;
    winRate: number;
    profitFactor: number;
    averageWin: number;
    averageLoss: number;
  };
  trades: BacktestTrade[];
  equity: { timestamp: string; value: number }[];
  positions: BacktestPosition[];
  metrics: {
    daily: { timestamp: string; return: number; drawdown: number }[];
    monthly: { timestamp: string; return: number }[];
    rolling: { timestamp: string; sharpe: number; sortino: number }[];
  };
}

export interface BacktestTrade {
  timestamp: string;
  type: "entry" | "exit";
  side: "buy" | "sell";
  price: number;
  quantity: number;
  value: number;
  fees: number;
  slippage: number;
  pnl?: number;
  pnlPercentage?: number;
}

export interface BacktestPosition {
  symbol: string;
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  side: "long" | "short";
  openedAt: string;
  closedAt?: string;
  pnl?: number;
  pnlPercentage?: number;
}
