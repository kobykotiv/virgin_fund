# Virgin Fund Project Structure

This document outlines the organization and structure of the Virgin Fund codebase for developers.

## Directory Structure

```
virgin_fund/
├── app/                    # Core application logic
│   ├── models/             # Data models and interfaces
│   │   ├── Asset.ts
│   │   ├── Performance.ts
│   │   ├── Portfolio.ts
│   │   └── Transaction.ts
│   ├── services/           # Business logic and API services
│   │   ├── DataService.ts
│   │   ├── MarketDataService.ts
│   │   └── PortfolioService.ts
│   ├── utils/              # Utilities and helper functions
│   │   └── calculationUtils.ts
│   ├── styles/             # Global and component styles
│   │   ├── components.css
│   │   └── main.css
│   ├── Dashboard.tsx       # Main application view
│   └── index.tsx           # Application entry point
├── components/             # React components organized by feature
│   ├── assets/             # Asset-related components
│   │   └── AssetList.tsx
│   ├── benchmark/          # Benchmark comparison components
│   │   └── BenchmarkComparison.tsx
│   ├── performance/        # Performance visualization components  
│   │   └── PerformanceChart.tsx
│   ├── portfolio/          # Portfolio management components
│   │   ├── PortfolioCard.tsx
│   │   └── PortfolioForm.tsx
│   ├── risk/               # Risk analysis components
│   │   └── RiskAnalysis.tsx
│   ├── shared/             # Shared UI components
│   │   ├── ErrorMessage.tsx
│   │   └── LoadingSpinner.tsx
│   └── transactions/       # Transaction-related components
│       ├── TransactionForm.tsx
│       └── TransactionHistory.tsx
├── docs/                   # Documentation
│   ├── api-documentation-mvp.md
│   ├── api-routes.md
│   ├── getting-started.md
│   ├── implementation-guide.md
│   ├── portfolio-models.md
│   └── project-structure.md
└── README.md               # Project overview
```

## Architecture Overview

### Model Layer

The model layer defines the core data structures used throughout the application:

- **Portfolio**: Represents a collection of assets with risk profile and metadata
- **Asset**: Represents an investment holding with quantity and price data
- **Transaction**: Records buying and selling activity
- **Performance**: Tracks portfolio performance over different timeframes

### Service Layer

Services encapsulate business logic and external data access:

- **PortfolioService**: Manages portfolio operations and calculations
- **DataService**: Handles data persistence (currently in-memory, would be API-based in production)
- **MarketDataService**: Retrieves market data (currently mock implementation)

### Component Layer

Components provide the user interface organized by feature area:

- **Portfolio Components**: Manage portfolio creation and display
- **Asset Components**: Display and manage assets within portfolios
- **Transaction Components**: Record and display transaction history
- **Performance Components**: Visualize performance metrics
- **Benchmark Components**: Compare portfolio to market benchmarks
- **Risk Components**: Analyze portfolio risk factors

### Utilities

Utility functions provide reusable calculations and helpers:

- **calculationUtils.ts**: Common financial calculations used across the application

## Data Flow

1. **User Actions**: Captured by React components
2. **Business Logic**: Processed by service layer
3. **Data Updates**: Managed by DataService
4. **State Updates**: React state updated with new data
5. **UI Updates**: Components re-render with updated state

## State Management

The application uses React's built-in state management with:

- **Local Component State**: For UI-specific state
- **Lifting State Up**: For sharing state between components
- **React Context** (planned): For global application state

## API Integration

The MVP currently uses in-memory storage via the DataService, but is designed to be replaced with real API calls in production.

## Styling Approach

The application uses:

- **CSS Variables**: For theming and consistency
- **Component-Scoped Classes**: For component-specific styling
- **Responsive Design**: For mobile and desktop support
