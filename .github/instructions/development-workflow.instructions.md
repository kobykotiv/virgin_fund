---
applyTo: '**/*.{ts,tsx,js,jsx,md}'
---

# Virgin Fund - Development Workflow

## Daily Development Cycle

### Morning Setup
1. **Pull Latest Changes**
   ```bash
   git pull origin main
   bun install  # Ensure dependencies are up to date
   ```

2. **Check Project Status**
   ```bash
   bun run build  # Verify build works
   bun dev        # Start development server
   ```

3. **Review Current Tasks**
   - Check project board/issues
   - Review recent commits
   - Check for any blocking issues

### Development Process

#### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes following coding standards
# Test changes locally
bun run build
bun dev

# Commit with descriptive message
git add .
git commit -m "feat: add feature description"
```

#### 2. Code Quality Checks
- [ ] TypeScript compilation passes
- [ ] ESLint passes
- [ ] Build succeeds
- [ ] Tests pass (if applicable)
- [ ] Code follows project conventions

#### 3. Testing Strategy
```typescript
// Unit tests for utilities
describe('calculateCompoundInterest', () => {
  it('should calculate correctly', () => {
    // Test implementation
  })
})

// Component tests
describe('SavingsCalculator', () => {
  it('should render form', () => {
    // Test implementation
  })
})

// Integration tests
describe('API Routes', () => {
  it('should handle valid requests', () => {
    // Test implementation
  })
})
```

### Code Review Process

#### Pre-Commit Checklist
- [ ] All TypeScript errors resolved
- [ ] No console.log statements (except for debugging)
- [ ] Proper error handling implemented
- [ ] Components have proper loading/error states
- [ ] Responsive design tested
- [ ] Accessibility considerations addressed

#### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Testing
- `chore`: Maintenance

**Examples**:
```
feat: add compound interest calculator
fix: resolve mobile navigation issue
docs: update API documentation
refactor: simplify backtest logic
```

### Component Development Workflow

#### 1. Plan Component Structure
```typescript
// Define component interface
interface ComponentNameProps {
  // Props definition
}

// Plan component states
type ComponentState = 'loading' | 'success' | 'error'
```

#### 2. Implement Component
```tsx
"use client"

import { useState, useEffect } from 'react'

export function ComponentName({ prop }: ComponentNameProps) {
  const [state, setState] = useState<ComponentState>('loading')

  useEffect(() => {
    // Component logic
  }, [])

  if (state === 'loading') return <div>Loading...</div>
  if (state === 'error') return <div>Error occurred</div>

  return <div>{/* Component JSX */}</div>
}
```

#### 3. Add Error Boundaries
```tsx
import { ErrorBoundary } from 'react-error-boundary'

export function SafeComponent() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <ComponentName />
    </ErrorBoundary>
  )
}
```

### API Development Workflow

#### 1. Plan API Structure
```typescript
// Request/Response types
interface ApiRequest {
  // Request structure
}

interface ApiResponse {
  success: boolean
  data?: any
  error?: string
}
```

#### 2. Implement API Route
```typescript
// app/api/feature/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Implementation
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
```

#### 3. Add API Client
```typescript
// lib/api/feature.ts
export async function fetchFeatureData() {
  const response = await fetch('/api/feature')
  const data = await response.json()

  if (!data.success) {
    throw new Error(data.error)
  }

  return data.data
}
```

### Database Development Workflow

#### 1. Plan Schema Changes
```sql
-- Plan table structure
CREATE TABLE feature_table (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. Update Supabase Schema
- Update migrations
- Test with local Supabase instance
- Update TypeScript types

#### 3. Implement Database Operations
```typescript
// lib/db/feature.ts
export async function createFeature(data: FeatureData) {
  const { data: result, error } = await supabase
    .from('feature_table')
    .insert(data)
    .select()
    .single()

  if (error) throw error
  return result
}
```

### Testing Workflow

#### 1. Unit Testing
```typescript
// __tests__/utils/calculator.test.ts
import { calculateInterest } from '@/lib/calculator'

describe('calculateInterest', () => {
  it('calculates simple interest correctly', () => {
    expect(calculateInterest(1000, 0.05, 1)).toBe(1050)
  })
})
```

#### 2. Component Testing
```typescript
// __tests__/components/Calculator.test.tsx
import { render, screen } from '@testing-library/react'
import { Calculator } from '@/components/Calculator'

describe('Calculator', () => {
  it('renders calculator form', () => {
    render(<Calculator />)
    expect(screen.getByText('Calculate')).toBeInTheDocument()
  })
})
```

#### 3. Integration Testing
```typescript
// __tests__/api/calculator.test.ts
describe('/api/calculator', () => {
  it('returns calculation result', async () => {
    const response = await fetch('/api/calculator', {
      method: 'POST',
      body: JSON.stringify({ principal: 1000, rate: 0.05 })
    })

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.result).toBeDefined()
  })
})
```

### Deployment Workflow

#### 1. Pre-Deployment Checks
```bash
# Run full test suite
bun test

# Build production version
bun run build

# Test production build locally
bun start
```

#### 2. Deployment Process
```bash
# Create deployment branch
git checkout -b deployment/v1.2.3

# Update version
npm version patch

# Push to deployment
git push origin deployment/v1.2.3
```

#### 3. Post-Deployment
- Monitor error logs
- Check performance metrics
- Update documentation
- Notify stakeholders

### Performance Monitoring

#### Key Metrics to Track
- Page load times
- API response times
- Error rates
- User engagement metrics

#### Performance Optimization
```typescript
// Code splitting
const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'))

// Image optimization
import Image from 'next/image'
<Image src="/image.jpg" width={500} height={300} priority />

// Caching strategies
export const revalidate = 3600 // ISR
```

### Security Checklist

#### Development Security
- [ ] No sensitive data in code
- [ ] Proper input validation
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection

#### Deployment Security
- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] Security headers set
- [ ] Database access restricted
- [ ] API keys secured

### Documentation Updates

#### When to Update Docs
- New features implemented
- API changes
- Configuration changes
- Breaking changes

#### Documentation Checklist
- [ ] README updated
- [ ] API documentation current
- [ ] Code comments added
- [ ] Changelog updated
- [ ] Migration guides provided

### Emergency Procedures

#### Build Failures
1. Check for TypeScript errors
2. Verify all imports are correct
3. Clear cache and rebuild
4. Check for missing dependencies

#### Runtime Errors
1. Check server logs
2. Verify environment variables
3. Test API endpoints
4. Check database connectivity

#### Rollback Process
```bash
# Quick rollback
git reset --hard HEAD~1
git push origin main --force

# Graceful rollback
git revert HEAD
git push origin main
```
