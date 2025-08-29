---
applyTo: '**/*.{ts,tsx,js,jsx}'
---

# Virgin Fund - AI Coding Guidelines

## Project Overview
Virgin Fund is a **Platform as a Service (PaaS)** for algorithmic trading and portfolio management. Built with Next.js 15, TypeScript, and TailwindCSS, it provides a comprehensive trading platform where users can deploy, monitor, and optimize trading strategies through an intuitive web interface powered by Supabase as the backend infrastructure.

## PaaS Architecture Principles

### Frontend-First Design
- **Primary Product**: The web application is the core product experience
- **User-Centric**: All features designed around trader workflows and user experience
- **Real-time Updates**: Live data synchronization between frontend and Supabase
- **Progressive Enhancement**: Core functionality works offline, enhanced features when connected

### Backend as a Service (Supabase)
- **Database**: PostgreSQL with real-time subscriptions and RLS policies
- **Authentication**: Built-in user management with social logins
- **API Layer**: RESTful APIs with automatic OpenAPI documentation
- **Real-time**: WebSocket connections for live trading data
- **Edge Functions**: Serverless functions for complex computations

### Service Integration Layer
- **Alpaca Markets**: Live trading execution and market data
- **External APIs**: Financial data providers, news feeds, analytics
- **Caching Strategy**: Redis/memory cache for market data, Supabase for user data
- **Background Jobs**: Automated strategy execution and portfolio rebalancing

## Core Architecture
- **Framework**: Next.js 15 with App Router (PaaS frontend)
- **Language**: TypeScript (type-safe PaaS development)
- **Styling**: TailwindCSS with shadcn/ui components
- **Database**: Supabase (BaaS infrastructure)
- **State Management**: React hooks + Context API + Supabase real-time
- **API Integration**: Alpaca Markets, TradingView, financial data providers

## File Structure Standards

### PaaS Frontend Organization
```
components/
├── ui/                    # Reusable UI components (shadcn/ui)
├── platform/             # Core platform components (dashboard, navigation)
├── trading/              # Trading-specific components (bots, strategies, orders)
├── analytics/            # Analytics and reporting components
├── onboarding/           # User onboarding and setup flows
└── layout/               # Layout components and providers
```

### PaaS Page Structure
```
app/
├── (platform)/           # Main platform routes (dashboard, trading)
├── (public)/             # Public marketing pages
├── api/                  # Platform APIs (Supabase integration)
├── auth/                 # Authentication flows
├── onboarding/           # User setup and configuration
└── [feature]/            # Feature-specific routes
```

### Backend Service Organization
```
lib/
├── supabase/             # Supabase client and utilities
├── services/             # External service integrations (Alpaca, etc.)
├── platform/             # Core platform business logic
├── trading/              # Trading engine and strategy logic
├── analytics/            # Analytics and reporting utilities
└── utils/                # General utilities
```

### Supabase Integration Patterns
```
supabase/
├── migrations/           # Database schema migrations
├── functions/            # Edge functions for complex operations
├── policies/             # Row Level Security policies
└── triggers/             # Database triggers and functions
```

## PaaS Coding Standards

### Platform-First Development
- **User Experience Priority**: Every feature must enhance the trader's experience
- **Scalable Architecture**: Design for thousands of concurrent users
- **Real-time Updates**: Implement live data synchronization patterns
- **Offline Resilience**: Core functionality works without constant connectivity
- **Progressive Enhancement**: Basic features work, advanced features enhance

### Supabase Integration Standards
- **Real-time Subscriptions**: Use Supabase real-time for live updates
- **Row Level Security**: Implement proper RLS policies for multi-tenant data
- **Optimistic Updates**: Update UI immediately, sync with backend
- **Error Boundaries**: Handle network failures gracefully
- **Caching Strategy**: Cache user data in Supabase, market data in memory/Redis

### TypeScript Standards
- **Strict Type Safety**: Enable strict mode for all platform code
- **Platform Types**: Define comprehensive types for trading domain
- **API Contracts**: Type all API responses and requests
- **Error Types**: Implement proper error handling with typed errors
- **Generic Patterns**: Use generics for reusable platform components

### React Component Patterns
- **Platform Components**: Build reusable components for trading workflows
- **Real-time Hooks**: Custom hooks for Supabase subscriptions
- **Loading States**: Implement skeleton loading for better UX
- **Error Recovery**: Components should handle and recover from errors
- **Accessibility**: WCAG compliant for professional trading platform

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
