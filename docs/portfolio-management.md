# Portfolio Management

## Overview
Users can create and manage multiple investment portfolios containing various assets.

## Data Models

### Portfolio
```typescript
interface Portfolio {
  id: string;
  userId: string;
  name: string;
  description?: string;
  type: 'stock' | 'crypto' | 'mixed';
  risk: 'conservative' | 'moderate' | 'aggressive';
  assets: Asset[];
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}
```

### Asset
```typescript
interface Asset {
  id: string;
  portfolioId: string;
  symbol: string;
  type: 'stock' | 'crypto' | 'etf' | 'other';
  quantity: number;
  averagePrice: number;
  currentPrice?: number;
  lastUpdated?: Date;
  transactions: Transaction[];
}
```

## Portfolio Operations

### Performance Tracking
- Real-time profit/loss calculation
- Historical performance charts
- Dividend tracking
- Cost basis calculations

### Risk Management
- Position size limits
- Portfolio diversification metrics
- Risk score calculation
- Exposure warnings

### Asset Management
- Buy/sell transactions
- Position averaging
- Split handling
- Dividend reinvestment

### Tax Management
- Tax lot identification methods (FIFO, LIFO, Specific ID)
- Tax-loss harvesting opportunities
- Capital gains reporting
- Dividend tax classification
- Tax-efficient rebalancing

## Portfolio Analysis
- Asset allocation visualization
- Sector distribution
- Geographic exposure
- Risk/reward metrics
- Correlation analysis
- Portfolio concentration metrics
- Performance attribution
- Benchmark comparison

## Data Integration
- Real-time price updates
- Corporate action handling
- Exchange rate conversion
- Tax lot tracking
