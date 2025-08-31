---
applyTo: '**/BotsWindow.tsx'
---

# Trading Bots Window - Overview

## Overview
The Trading Bots Window provides a comprehensive interface for managing automated trading strategies, monitoring bot performance, and controlling bot operations within the desktop-inspired trading platform.

## Key Components

### Bot Management Interface
- **Bot List**: Display all configured trading bots
- **Status Indicators**: Visual status (running/stopped/error)
- **Control Actions**: Start/stop individual bots
- **Performance Metrics**: P&L tracking and last run times

### Bot Data Structure
```typescript
interface TradingBot {
  id: string
  name: string
  status: 'running' | 'stopped' | 'error'
  strategy: string
  portfolioId: string
  lastRun: string
  pnl: number
}
```

## Implementation Guidelines

### State Management
```typescript
const [bots, setBots] = useState<TradingBot[]>([])
const [loading, setLoading] = useState(true)
```

### Data Persistence
- localStorage for bot configurations
- JSON serialization for complex data
- Migration support for future database storage

### Status Management
```typescript
const toggleBotStatus = (botId: string) => {
  setBots(prev => prev.map(bot =>
    bot.id === botId
      ? { ...bot, status: bot.status === 'running' ? 'stopped' : 'running' }
      : bot
  ))
}
```

### Visual Indicators
- Color-coded status dots (green/red/gray)
- Status badges with appropriate variants
- P&L color coding (green/red)
- Loading states with skeleton UI

## UI Requirements

### Layout Structure
- Header with title and create button
- Grid layout for bot cards
- Empty state with call-to-action
- Quick actions section

### Card Design
- Hover effects and transitions
- Consistent spacing and typography
- Responsive grid system
- Status-based styling

### Interactive Elements
- Toggle buttons for bot control
- Navigation to detailed views
- Settings and configuration access
- Performance analytics links

## Features

### Bot Operations
- Start/stop individual bots
- Bulk operations (future)
- Emergency stop all (future)
- Scheduled operations (future)

### Monitoring
- Real-time status updates
- Performance tracking
- Error logging and alerts
- Resource usage monitoring

### Integration
- Portfolio association
- Strategy selection
- Alpaca API integration
- Signal processing

## Performance Optimization

### Rendering
- Efficient list rendering with keys
- Memoized components for expensive operations
- Virtual scrolling for large bot lists
- Optimized state updates

### Data Handling
- Debounced status updates
- Cached bot configurations
- Efficient API calls
- Background processing

## Security Considerations

### Access Control
- User authentication required
- Bot ownership validation
- API key security
- Rate limiting

### Risk Management
- Position size limits
- Stop loss enforcement
- Maximum drawdown controls
- Emergency shutdown procedures

## Future Enhancements

### Advanced Features
- Bot templates and presets
- A/B testing for strategies
- Machine learning integration
- Social trading features

### Analytics
- Detailed performance charts
- Risk metrics dashboard
- Comparative analysis
- Predictive modeling

### Automation
- Auto-scaling based on performance
- Dynamic strategy adjustment
- Market condition adaptation
- Self-optimization algorithms

## Development Guidelines

### Code Organization
- Separate concerns (UI, logic, data)
- Consistent naming conventions
- TypeScript interfaces for all data
- Error boundaries and fallbacks

### Testing Strategy
- Unit tests for bot operations
- Integration tests for API calls
- UI tests for interactions
- Performance tests for scalability

### Documentation
- Inline code comments
- API documentation
- User guides for features
- Troubleshooting guides
