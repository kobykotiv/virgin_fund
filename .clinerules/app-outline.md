## Brief overview
  - Application-wide rules for the "virgin_fund" trading platform, covering core features, UI/UX, data handling, security, extensibility, and documentation.

## App purpose
  - A modern trading platform for managing API keys, viewing account data, placing trades, and monitoring portfolio performance.

## Core features
  - Secure API key management (add, edit, delete, encrypt, and store keys).
  - User authentication and profile management.
  - Trading dashboard: account summary, portfolio, recent trades, real-time market data.
  - Order management: place, modify, cancel, and view orders.
  - Strategy automation: create, backtest, and run trading strategies.
  - Notifications and activity logs.

## UI/UX guidelines
  - All pages must be accessible and responsive.
  - Use a consistent component library (shadcn/ui or Radix UI).
  - Maintain a modular and extensible UI structure.

## Data handling
  - Always fetch real or mock data; never use static placeholders.

## Security
  - All sensitive actions must be protected.
  - Use environment variables for secrets.
  - Never expose API keys in client code.

## Extensibility
  - The app should be modular and easy to extend with new features.

## Conflict resolution
  - If a user prompt conflicts with this outline, ask for clarification.

## Documentation
  - Always document new features or architectural changes in the codebase.
