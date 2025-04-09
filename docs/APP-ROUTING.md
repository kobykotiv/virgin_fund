# App Router Architecture

## Overview

Virgin Fund uses Next.js 13+ App Router for a feature-first organization of routes and components.

## Route Structure

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

## Route Groups

### Authentication Routes `(auth)`
- Handles user authentication flows
- Protected by authentication middleware
- Redirects authenticated users to dashboard

### Dashboard Routes `(dashboard)`
- Protected routes requiring authentication
- Shared dashboard layout with navigation
- Real-time data updates via WebSocket
- Rate-limited API requests

## Common Patterns

### Loading States
```tsx
// app/(dashboard)/portfolio/loading.tsx
export default function Loading() {
  return <PortfolioSkeleton />
}
```

### Error Handling
```tsx
// app/(dashboard)/error.tsx
export default function Error({ error, reset }) {
  return (
    <ErrorDisplay 
      message={error.message}
      onRetry={() => reset()}
    />
  )
}
```

### Layout Structures
```tsx
// app/(dashboard)/layout.tsx
export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dashboard-layout">
      <DashboardNav />
      <main>{children}</main>
      <TradingPanel />
    </div>
  )
}
```

## Key Features

### Authentication
- NextAuth.js integration
- JWT token handling
- Protected API routes
- Role-based access control

### Real-time Updates
- WebSocket connections
- Server-sent events
- Optimistic updates
- Cache invalidation

### Data Fetching
- Server components
- Route handlers
- API integration
- Data revalidation

## Performance Considerations

### Route Segmentation
- Each route segment independently deployable
- Automatic code splitting
- Parallel route loading
- Streaming data with Suspense

### Caching Strategy
- Full route cache
- Time-based revalidation
- On-demand revalidation
- Statically generated pages

### API Route Handlers
- Edge runtime support
- Rate limiting
- Request validation
- Error boundaries

## Development Guidelines

### Creating New Routes
1. Place in appropriate route group
2. Implement loading state
3. Add error handling
4. Set up data fetching
5. Add TypeScript interfaces

### Route Naming Conventions
- Use kebab-case for URLs
- Group related features
- Descriptive route names
- Consistent patterns

### State Management
- Server components first
- Client state with hooks
- Route group isolation
- Parallel routes
