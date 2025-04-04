# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Advanced Calculator Suite:
  - Monte Carlo Simulation for price prediction
  - Value at Risk (VaR) calculator
  - Portfolio Stress Testing
  - Backtesting functionality
  - Correlation Matrix analysis
  - Performance Metrics dashboard
- Unified Side Navigation for calculators
- Integration with user's historical data
- Local storage persistence for calculator preferences
- Real-time data visualization for simulations
- Consolidated Calculators menu with expanded options:
  - Portfolio Allocation Calculator
  - Risk/Reward Ratio Calculator
  - Position Sizing Calculator
  - Profit/Loss Calculator
  - Compound Interest Calculator
  - Drawdown Analysis Calculator
- New calculator layout with consistent styling
- Dashboard Settings Page that allows users to configure their Alpaca API credentials
- MockDataWarning component that displays a prominent warning in the footer when mock data is being used
- Integration with Alpaca API for fetching real market data (based on user-provided credentials)
- Updated PortfolioAllocation component to dynamically load either mock data or real market data
- Added documentation for all new components and features
- Improved accessibility for form elements and warning notifications
- Symmetric encryption for API credentials using AES-GCM
- Environment variable for credential encryption key
- Secure credential storage utilities

### Changed
- Modified the portfolio allocation data flow to support both mock and real data sources
- Enhanced the chart rendering to indicate the data source being used
- Moved the mock data warning from the top right corner to the footer for better visibility

## [0.1.0] - Initial Release

### Added
- PortfolioAllocation component for visualizing investment allocations
- Responsive design with dark/light mode support
- Canvas-based donut chart with dynamic resizing
