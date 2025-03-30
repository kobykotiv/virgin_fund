# User Portfolio System Documentation

## Overview
The system supports multiple portfolios per user with different investment strategies and asset holding types.

## Portfolio Types

### Account Types
- `standard` - Basic investment account
- `margin` - Leveraged trading account 
- `retirement` - IRA/401k accounts
- `managed` - Professionally managed accounts

### Investment Strategies
- `passive` - Index/ETF based investing
- `active` - Active trading and position management
- `automated` - Bot-driven trading
- `copy` - Copy trading from other users/strategies

## Data Models

### User Portfolio Structure
```typescript
interface UserPortfolio {
  id: string;
  userId: string;
  name: string;
  accountType: 'standard' | 'margin' | 'retirement' | 'managed';
  strategy: 'passive' | 'active' | 'automated' | 'copy';
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  assets: Asset[];
  metadata: {
    leverage?: number;
    marginRequirement?: number;
    automationRules?: AutomationRule[];
    copySettings?: CopyTradeSettings;
  };
}

interface Asset {
  symbol: string;
  quantity: number;
  averagePrice: number;
  holdingType: 'long' | 'short' | 'option' | 'future';
  metadata: {
    stopLoss?: number;
    takeProfit?: number;
    leverageRatio?: number;  
  };
}
```
