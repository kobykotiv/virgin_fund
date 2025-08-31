---
applyTo: '**/portfolio.tsx'
---

# Portfolios Dashboard - Current Positions Section

## Overview
The Current Positions section displays real-time position data from the Alpaca account, showing open trades with profit/loss calculations and market values.

## Key Components

### Position Items
- **Symbol**: Stock/crypto ticker symbol
- **Quantity**: Number of shares/units held
- **Average Entry Price**: Cost basis per share
- **Market Value**: Current total value
- **Unrealized P/L**: Profit/loss amount
- **Unrealized P/L %**: Profit/loss percentage

### Data Source
- Fetched from `/api/positions` endpoint
- Real-time Alpaca positions API
- Updates with account data refresh

## Implementation Guidelines

### Data Structure
```typescript
interface Position {
  symbol: string;
  qty: string;
  avg_entry_price: string;
  market_value: string;
  unrealized_pl: string;
  unrealized_plpc: string;
}
```

### Display Logic
```typescript
{positions.length === 0 ? (
  <p className="text-muted-foreground">No open positions.</p>
) : (
  <div className="space-y-2">
    {positions.map((position) => (
      <PositionCard key={position.symbol} position={position} />
    ))}
  </div>
)}
```

### P/L Visualization
- Green text for positive P/L
- Red text for negative P/L
- Percentage formatting with 2 decimal places
- Currency formatting for dollar amounts

### Real-time Updates
- Refresh with account data
- WebSocket integration (future)
- Manual refresh capability
- Auto-refresh intervals (future)

## UI Requirements
- Card-based layout with consistent styling
- Two-column layout (symbol/qty left, value/P&L right)
- Color-coded P/L indicators
- Responsive design for mobile/desktop
- Loading states during fetch operations

## Calculations
- Market Value = Current Price × Quantity
- Unrealized P/L = Market Value - (Entry Price × Quantity)
- Unrealized P/L % = (Unrealized P/L / (Entry Price × Quantity)) × 100

## Performance Optimization
- Efficient number parsing and formatting
- Memoized calculations
- Virtual scrolling for large position lists
- Optimized re-rendering

## Risk Management
- Position size limits
- Stop loss indicators (future)
- Diversification warnings (future)
- Exposure calculations

## Integration Points
- Links to detailed position views
- Integration with trading signals
- Portfolio allocation analysis
- Historical performance tracking

## Future Features
- Position alerts and notifications
- Advanced P/L charts
- Position rebalancing suggestions
- Tax lot tracking
- Options position handling
