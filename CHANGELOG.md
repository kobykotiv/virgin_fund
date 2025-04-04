# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Dashboard Settings Page that allows users to configure their Alpaca API credentials
- MockDataWarning component that displays a prominent warning in the footer when mock data is being used
- Integration with Alpaca API for fetching real market data (based on user-provided credentials)
- Updated PortfolioAllocation component to dynamically load either mock data or real market data
- Added documentation for all new components and features
- Improved accessibility for form elements and warning notifications

### Changed
- Modified the portfolio allocation data flow to support both mock and real data sources
- Enhanced the chart rendering to indicate the data source being used
- Moved the mock data warning from the top right corner to the footer for better visibility

## [0.1.0] - Initial Release

### Added
- PortfolioAllocation component for visualizing investment allocations
- Responsive design with dark/light mode support
- Canvas-based donut chart with dynamic resizing
