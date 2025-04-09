# Available Scripts

This document details all available npm scripts and their usage in the project.

## Development Scripts

### `npm run dev`
Starts the development server with hot reloading.
```bash
npm run dev
# or
yarn dev
```

### `npm run build`
Builds the application for production.
```bash
npm run build
# or
yarn build
```

## Database Scripts

### `npm run db:migrate`
Runs pending database migrations.
```bash
npm run db:migrate
npm run db:migrate:reset  # Reset database and rerun all migrations
```

### `npm run db:seed`
Seeds the database with test data.
```bash
npm run db:seed
npm run db:seed:reset  # Clear and reseed database
```

## Monitoring Scripts

### `npm run monitor`
Starts application monitoring.
```bash
npm run monitor
npm run monitor:debug  # Detailed monitoring output
```

## Testing Scripts

### `npm run test`
Runs the Jest test suite.
- Watches for changes in development
- Single run in CI environment
```bash
npm run test
npm run test:ci
```

### `npm run coverage`
Generates test coverage report.
```bash
npm run coverage
```

## Code Quality Scripts

### `npm run lint`
Runs ESLint to check code style.
```bash
npm run lint
npm run lint:fix  # Auto-fixes issues
```

### `npm run format`
Runs Prettier to format code.
```bash
npm run format
```

## Analysis Scripts

### `npm run analyze`
Analyzes bundle size using @next/bundle-analyzer.
```bash
npm run analyze
```
