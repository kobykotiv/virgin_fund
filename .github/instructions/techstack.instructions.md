# Tech Stack Instructions

## Runtime
- **Bun**: A fast JavaScript runtime.

## Framework
- **Next.js**: A React-based framework for building web applications.

## Database
- **Supabase**: An open-source Firebase alternative for managing databases and authentication.

## Setup
- Install Bun: Follow the instructions at [https://bun.sh](https://bun.sh).
- Configure Next.js: Refer to the Next.js documentation at [https://nextjs.org/docs](https://nextjs.org/docs).
- Set up Supabase: Visit [https://supabase.com/docs](https://supabase.com/docs) for database configuration and integration.
- **Backend API**: Use Supabase to create and manage your backend API. Refer to the Supabase documentation for creating tables, writing SQL queries, and setting up RESTful endpoints.

## Frontend Setup
- **Next.js File Structure**: 
  - The `app/` directory contains route files (e.g., `index.tsx` for the homepage).
  - The `public/` directory stores static assets like images.
  - The `styles/` directory contains global and modular CSS files.
- Create components in the `components/` directory for reusable UI elements.
- Refer to the Next.js documentation for best practices on structuring your application.

```
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx       # /login
│   └── register/
│       └── page.tsx       # /register
├── (dashboard)/
│   ├── layout.tsx         # Shared dashboard layout
│   ├── page.tsx           # /dashboard
│   ├── portfolio/
│   │   ├── page.tsx       # /dashboard/portfolio 
│   │   └── [id]/
│   │       └── page.tsx   # /dashboard/portfolio/[id]
│   ├── bots/
│   │   ├── page.tsx       # /dashboard/bots
│   │   └── [id]/
│   │       └── page.tsx   # /dashboard/bots/[id]
│   └── settings/
│       └── page.tsx       # /dashboard/settings
├── api/
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.ts   # Authentication API routes
│   ├── bots/
│   │   └── route.ts      # Trading bot API endpoints
│   └── portfolio/
│       └── route.ts      # Portfolio management endpoints
└── layout.tsx            # Root layout
```



# Tooling Guide

## Introduction

This document provides guidelines and information for creating tooling to support the development, testing, and deployment of this project. It covers project structure, coding conventions, testing strategies, and deployment procedures.

## Project Structure

*   `components/`: Reusable UI components.
*   `apps/`: Next.js pages (routes).
*   `public/`: Static assets.
*   `styles/`: Global styles and CSS modules.
*   `lib/`: Utility functions and helper modules.
*   `tests/`: Unit and integration tests.

## Coding Conventions

*   Use TypeScript for all new code.
*   Follow the Airbnb JavaScript Style Guide with modifications as needed.
*   Write clear, concise, and well-commented code.
*   Use consistent naming conventions.
*   Keep components small and focused.
*   Avoid deeply nested components.

### Example

```typescript
// filepath: example.ts
/**
 * Adds two numbers together.
 *
 * @param a - The first number.
 * @param b - The second number.
 * @returns The sum of a and b.
 */
export function add(a: number, b: number): number {
  return a + b;
}
```

## Testing

*   Write unit tests for all components and utility functions.
*   Use Jest and React Testing Library for testing.
*   Aim for high test coverage.
*   Run tests before every commit.

### Example

```javascript
// filepath: example.test.js
import { add } from '../lib/utils';

test('adds 1 + 2 to equal 3', () => {
  expect(add(1, 2)).toBe(3);
});
```

## Deployment

*   Deploy to Vercel using Git integration.
*   Use environment variables for configuration.
*   Monitor application performance and logs.

## Tooling Examples

### Example 1: Code Generator

A script to generate new components with a standard template:

```bash
node scripts/generate-component.js MyComponent
```

This script should:

1.  Accept a component name as an argument.
2.  Create a new directory under `components/` with the component name.
3.  Create a `index.tsx` file with a basic functional component.
4.  Create a `index.module.css` file for styling.
5.  Create a `index.test.tsx` file for unit tests.

### Example 2: Linting and Formatting

Automated linting and formatting using ESLint and Prettier:

```bash
npm run lint
npm run format
```

These scripts should:

1.  Run ESLint to identify code style issues.
2.  Run Prettier to automatically format the code.
3.  Use a configuration file (`.eslintrc.js`, `.prettierrc.js`) to define the rules.
4.  Integrate with the IDE for real-time feedback.

### Example 3: API Mocking Tool

A tool to mock API responses for testing purposes:

This tool should:

1.  Intercept API requests based on a configuration file.
2.  Return predefined mock responses.
3.  Support different scenarios and edge cases.
4.  Allow dynamic response generation.

## Available Scripts

### Build Tools
- `npm run build`: Builds the production application
- `npm run dev`: Starts development server
- `npm run analyze`: Analyzes bundle size

### Code Quality
- `npm run lint`: Runs ESLint checks
- `npm run type-check`: Runs TypeScript type checking
- `npm run test`: Runs Jest test suite
- `npm run coverage`: Generates test coverage report

## Tool Implementation Guidelines

### Component Generator
```typescript
// scripts/generate-component.js
const componentTemplate = (name) => `
import React from 'react';
import styles from './${name}.module.css';

export interface ${name}Props {
  // Add props here
}

export const ${name}: React.FC<${name}Props> = () => {
  return <div className={styles.container}></div>;
};
`;

// Usage: node scripts/generate-component.js Button
```

### API Mock Implementation
```typescript
// lib/mock-api/index.ts
export const mockApiResponse = (endpoint: string, data: any) => {
  if (process.env.NEXT_PUBLIC_USE_MOCK_API !== 'true') return;
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), 100);
  });
};
```

## Development Tools

### Database Tools
- Database migration tool
- Seeding utilities
- Schema visualization

### Monitoring Tools
- Performance monitoring
- Error tracking
- Usage analytics

### Code Generation
- Component generators
- API route generators
- Type generators

### Testing Tools
- Unit test runners
- Integration test suite
- E2E testing framework
- Coverage reporting

## Additional Resources

*   [Next.js Documentation](https://nextjs.org/docs)
*   [TypeScript Documentation](https://www.typescriptlang.org/docs/)
*   [Jest Documentation](https://jestjs.io/docs/en/getting-started)
*   [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)



## Development Environment

### Prerequisites

- **Node.js**: Ensure you have Node.js installed. Bun is used as the package manager.

- **Docker**: Required for containerized deployments.

- **Supabase**: Used for backend services like authentication and database.

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/kobykotiv/virgin_fund.git
   ```

2. Navigate to the project directory:

   ```bash
   cd virgin_fund
   ```

3. Install dependencies using Bun:

   ```bash
   bun install
   ```

4. Start the development server:

   ```bash
   bun dev
   ```
