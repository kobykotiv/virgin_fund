# Portfolio Models - MVP

## Core Models

### Portfolio
```typescript
interface Portfolio {
  id: string;
  userId: string;
  name: string;
  type: 'standard' | 'margin';
  risk: 'conservative' | 'moderate' | 'aggressive'; 
  assets: Asset[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Asset
```typescript
interface Asset {
  id: string;
  portfolioId: string;
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice?: number;
  lastUpdated?: Date;
}
```

### Transaction  
```typescript
interface Transaction {
  id: string;
  portfolioId: string;
  assetId: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: Date;
}
```

### Performance
```typescript
interface Performance {
  portfolioId: string;
  timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all';
  totalValue: number;
  pnl: number;
  pnlPercentage: number;
  benchmarkComparison?: number;
  lastUpdated: Date;
}
```

## Implementation Details

### Required Operations (MVP Priority)
1. Create/edit portfolios
2. Add/remove assets
3. Record transactions
4. Calculate performance

### MVP Implementation Phases
1. **Phase 1:** Basic portfolio creation and asset management
2. **Phase 2:** Transaction recording and history
3. **Phase 3:** Performance calculation and visualization

# Portfolio Models Documentation

## Core Portfolio Models

### 1. Basic DCA Portfolio
- Fixed interval purchases
- Single or multiple assets
- Automated rebalancing options
- Risk level: Low
- Best for: New investors

### 2. Grid Trading Portfolio
- Price-based grid system
- Buy low, sell high automation
- Customizable grid spacing
- Risk level: Medium
- Best for: Range-bound markets

### 3. Momentum Portfolio
- Technical indicator based
- Trend following strategy
- Dynamic position sizing
- Risk level: High
- Best for: Trending markets

### 4. Basket Portfolio
- Multi-asset allocation
- Regular rebalancing
- Correlation-based weighting
- Risk level: Medium
- Best for: Diversification

## Risk Management

### Position Sizing
- Maximum position size: 20% per asset
- Portfolio correlation limits
- Dynamic sizing based on volatility
- Stop-loss requirements
- Take-profit targets

### Monitoring Requirements
- Real-time performance tracking
- Risk metrics calculation
- Exposure analysis
- Drawdown monitoring
- Rebalancing triggers

## Implementation Guidelines

### Minimum Requirements
- Asset liquidity thresholds
- Market cap restrictions
- Volume requirements
- Spread limitations
- Execution rules

### Best Practices
- Gradual position building
- Correlation monitoring
- Risk-adjusted sizing
- Regular rebalancing
- Performance review
