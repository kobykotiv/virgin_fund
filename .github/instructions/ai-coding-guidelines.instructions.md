---
applyTo: '**/*.{ts,tsx,js,jsx}'
---

# Virgin Fund - AI Coding Guidelines

## Project Overview
Virgin Fund is a comprehensive finance and trading web application built with Next.js 15, TypeScript, and TailwindCSS. It provides trading bot management, backtesting tools, financial calculators, portfolio tracking, and Alpaca Markets integration.

## Core Architecture
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS with shadcn/ui components
- **Database**: Supabase
- **State Management**: React hooks + Context API
- **API Integration**: Alpaca Markets, TradingView

## File Structure Standards

### Component Organization
```
components/
├── ui/                    # Reusable UI components (shadcn/ui)
├── landing/              # Landing page components
├── dashboard/            # Dashboard-specific components
├── [feature]/            # Feature-specific components
└── layout/               # Layout components
```

### Page Structure
```
app/
├── (public)/             # Public routes
├── (protected)/          # Protected routes (auth required)
├── api/                  # API routes
├── dashboard/            # Dashboard pages
└── [feature]/            # Feature pages
```

### Utility Organization
```
lib/
├── utils/                # General utilities
├── services/             # External service integrations
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── constants/            # Application constants
```

## Coding Standards

### TypeScript
- Use strict type checking
- Define interfaces for all data structures
- Use union types for API responses
- Implement proper error types

### React Components
- Use functional components with hooks
- Add "use client" directive for client components
- Implement proper loading and error states
- Use TypeScript for all props

### API Routes
- Use NextResponse for consistent responses
- Implement proper error handling
- Validate input data
- Use middleware for authentication

### Database Operations
- Use Supabase client for database operations
- Implement proper error handling
- Use transactions for complex operations
- Validate data before insertion

## Development Workflow

### Before Making Changes
1. Check existing patterns in similar files
2. Review related components and utilities
3. Test build to ensure no breaking changes
4. Update types if adding new data structures

### Code Quality Checks
1. Run TypeScript compiler
2. Check for linting errors
3. Test component functionality
4. Verify responsive design

### Commit Guidelines
1. Use descriptive commit messages
2. Group related changes
3. Test before committing
4. Update documentation as needed

## Common Patterns

### Error Handling
```typescript
try {
  const result = await someAsyncOperation()
  return { success: true, data: result }
} catch (error) {
  console.error('Operation failed:', error)
  return { success: false, error: error.message }
}
```

### API Route Structure
```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Implementation
    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

### Component Structure
```tsx
"use client"

interface ComponentProps {
  // Props definition
}

export function ComponentName({ prop }: ComponentProps) {
  // Implementation
  return <div>{/* JSX */}</div>
}
```

## Build & Deployment

### Local Development
```bash
bun install
bun dev
```

### Production Build
```bash
bun run build
bun start
```

### Environment Variables
- Use `.env.local` for local development
- Never commit sensitive data
- Document required environment variables

## Security Considerations
- Validate all user inputs
- Use HTTPS in production
- Implement proper authentication
- Sanitize data before database operations
- Use environment variables for sensitive data

## Performance Optimization
- Use React.memo for expensive components
- Implement proper loading states
- Optimize images and assets
- Use proper caching strategies
- Minimize bundle size

## Testing Strategy
- Write unit tests for utilities
- Test components with React Testing Library
- Integration tests for API routes
- E2E tests for critical user flows

## Documentation
- Update README for new features
- Document API endpoints
- Add JSDoc comments for complex functions
- Maintain changelog for releases
