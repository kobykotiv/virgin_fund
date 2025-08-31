---
applyTo: '**/portfolio.tsx'
---

# Portfolios Dashboard - Main Overview

## Overview
The Portfolios Dashboard is a comprehensive interface for managing trading portfolios with Alpaca Markets integration. It provides authenticated access to account data, portfolio management, and position tracking.

## Architecture

### Core Components
- **Account Metrics**: Real-time Alpaca account data display
- **Portfolio List**: User portfolio management interface
- **Current Positions**: Live position tracking with P/L
- **Portfolio Creation**: New portfolio setup with validation

### Data Flow
1. **Authentication**: Secure Alpaca API key management
2. **Data Fetching**: Parallel API calls for account and positions
3. **State Management**: React hooks for local state
4. **Persistence**: localStorage for portfolio data
5. **UI Updates**: Responsive components with loading states

## Implementation Structure

### Main Component
```typescript
export default function Portfolio() {
  // State management
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [account, setAccount] = useState<AlpacaAccount | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);

  // Data fetching
  useEffect(() => {
    fetchAccount();
    loadPortfolios();
  }, []);

  // Component logic
  return (
    <DashboardLayout>
      <AccountMetricsSection account={account} />
      <PortfolioManagementSection
        portfolios={portfolios}
        selectedPortfolio={selectedPortfolio}
        onSelect={setSelectedPortfolio}
        onCreate={createPortfolio}
      />
      <PositionsSection positions={positions} />
    </DashboardLayout>
  );
}
```

### API Integration
- `/api/account`: Alpaca account details
- `/api/positions`: Current positions data
- Secure server-side key management
- Error handling and fallbacks

## Key Features

### Authentication & Security
- Alpaca API key authentication
- Server-side key storage
- Paper/live trading modes
- Rate limiting and error handling

### Portfolio Management
- Create portfolios with capital allocation
- Select and manage active portfolios
- Capital validation against buying power
- Persistent storage with localStorage

### Real-time Data
- Live account metrics
- Position P/L tracking
- Manual refresh capability
- Loading and error states

### User Experience
- Responsive design for all devices
- Intuitive navigation and selection
- Clear visual hierarchy
- Contextual actions and feedback

## Development Guidelines

### Code Organization
- Separate concerns by section
- Consistent naming conventions
- TypeScript interfaces for all data
- Error boundaries and fallbacks

### Performance
- Efficient API calls with Promise.all
- Memoized expensive calculations
- Optimized re-rendering
- Debounced user interactions

### Testing Strategy
- Unit tests for utility functions
- Integration tests for API calls
- Component tests for UI interactions
- E2E tests for critical flows

### Maintenance
- Clear documentation and comments
- Modular component structure
- Consistent styling with Tailwind
- Regular dependency updates

## Future Roadmap

### Phase 1: Core Features
- Enhanced position management
- Portfolio performance charts
- Advanced filtering and search

### Phase 2: Advanced Trading
- Automatic rebalancing
- Signal-based trading
- Risk management controls

### Phase 3: Analytics
- Historical performance analysis
- Comparative portfolio metrics
- Tax optimization tools

### Phase 4: Enterprise Features
- Multi-user collaboration
- API integrations
- Advanced reporting

## Deployment Considerations

### Environment Setup
- Alpaca API keys configuration
- Database migration for portfolios
- Environment-specific settings
- Monitoring and logging

### Security
- API key rotation
- Input validation and sanitization
- Rate limiting implementation
- Audit trail maintenance

### Scalability
- Database optimization
- Caching strategies
- CDN for static assets
- Load balancing considerations

## Contributing Guidelines

### Code Standards
- Follow existing TypeScript patterns
- Use shadcn/ui components consistently
- Implement proper error handling
- Add comprehensive tests

### Documentation
- Update component documentation
- Maintain API endpoint docs
- Create user guides for features
- Document deployment procedures

### Review Process
- Code review for all changes
- Testing requirements
- Performance impact assessment
- Security review for sensitive features
