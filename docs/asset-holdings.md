# Asset Holdings Documentation

## Overview
The system supports multiple ways to hold and manage assets across different portfolio types.

## Holding Types

### Long Positions
- Standard buy and hold
- Dollar-cost averaging (DCA)
- Swing trading
- Position trading

### Short Positions
- Short selling
- Inverse ETFs
- Put options
- Bear spreads

### Derivatives
- Call/Put options
- Futures contracts
- CFDs (where available)
- Spreads and combinations

### Automated Holdings
```typescript
interface AutomatedHolding {
  type: 'dca' | 'grid' | 'martingale' | 'rebalancing';
  parameters: {
    interval?: string;    // '1d', '1w', '1m'
    amount?: number;      // For DCA
    gridLevels?: number;  // For grid trading
    rebalanceThreshold?: number;
    maxDrawdown?: number;
  };
  automationRules: AutomationRule[];
}

interface AutomationRule {
  condition: {
    indicator: string;
    comparison: '>' | '<' | '==' | '>=';
    value: number;
  };
  action: {
    type: 'buy' | 'sell' | 'rebalance';
    amount: number | 'all';
    price?: number;
  };
}
```
