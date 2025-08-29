---
applyTo: '**/*.{ts,tsx,js,jsx,json,md}'
---

# Virgin Fund - Troubleshooting Guide

## Build Errors

### Parallel Pages Conflict
**Error**: "You cannot have two parallel pages that resolve to the same path"
**Solution**:
1. Check for duplicate page files in different route groups
2. Rename conflicting routes (e.g., `/bots` → `/my-bots`)
3. Ensure route groups don't create URL conflicts

### Missing Module Errors
**Common Missing Modules**:
- `@/lib/auth` - Create authentication configuration
- `@/lib/supabaseAdmin` - Create Supabase admin client
- `@/lib/session` - Create session utilities
- `@/components/client-nav` - Replace with existing nav component

**Solution**: Create missing modules with proper exports

### ImageResponse Import Error
**Error**: "ImageResponse moved from 'next/server' to 'next/og'"
**Solution**:
```typescript
// Change this:
import { ImageResponse } from 'next/server'
// To this:
import { ImageResponse } from 'next/og'
```

### SSR in Server Components
**Error**: "ssr: false is not allowed with next/dynamic in Server Components"
**Solution**:
1. Remove `ssr: false` from dynamic imports in server components
2. Or move the component to a client component
3. Or use regular imports instead of dynamic

### Client Component Hook Usage
**Error**: "useState only works in client components"
**Solution**: Add `"use client"` directive at top of file

## Runtime Errors

### Authentication Issues
**Problem**: API routes failing with 401 Unauthorized
**Checks**:
1. Verify NextAuth configuration
2. Check session tokens
3. Validate environment variables
4. Ensure proper middleware setup

### Database Connection Issues
**Problem**: Supabase connection failures
**Checks**:
1. Verify environment variables
2. Check Supabase project status
3. Validate connection strings
4. Test with Supabase dashboard

### API Integration Issues
**Problem**: Alpaca API failures
**Checks**:
1. Verify API credentials
2. Check rate limits
3. Validate request format
4. Test with Alpaca sandbox

## Development Environment Issues

### Package Installation Problems
**Problem**: Dependencies not installing correctly
**Solutions**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Or with bun
rm -rf node_modules bun.lockb
bun install
```

### Port Conflicts
**Problem**: Port 3000 already in use
**Solutions**:
```bash
# Kill process on port
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### Environment Variable Issues
**Problem**: Environment variables not loading
**Checks**:
1. File exists: `.env.local`
2. Variables prefixed with `NEXT_PUBLIC_` for client access
3. No spaces around `=`
4. Restart development server after changes

## Performance Issues

### Slow Build Times
**Optimizations**:
1. Enable webpack build worker
2. Use parallel compilation
3. Optimize bundle splitting
4. Cache dependencies

### Large Bundle Size
**Solutions**:
1. Code splitting with dynamic imports
2. Tree shaking unused dependencies
3. Optimize images
4. Use lighter alternatives

### Memory Issues
**Problem**: Out of memory during build
**Solutions**:
```bash
# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

## Deployment Issues

### Production Build Failures
**Common Causes**:
1. TypeScript errors
2. Missing environment variables
3. Incorrect import paths
4. Build-time only code in runtime

### Docker Issues
**Problem**: Container build failures
**Checks**:
1. Correct Dockerfile syntax
2. Proper .dockerignore
3. Environment variables in container
4. Port exposure

## Database Issues

### Migration Problems
**Problem**: Database migrations failing
**Solutions**:
```bash
# Reset and reapply migrations
npx prisma migrate reset --force
npx prisma generate
```

### Seed Data Issues
**Problem**: Seed scripts not working
**Checks**:
1. Correct seed file path
2. Database connection
3. Data format validation

## Testing Issues

### Test Failures
**Common Issues**:
1. Missing test dependencies
2. Incorrect test setup
3. Async operations not handled
4. Component mocking issues

### Coverage Issues
**Problem**: Low test coverage
**Solutions**:
1. Add unit tests for utilities
2. Integration tests for components
3. E2E tests for critical flows

## Quick Fixes

### Clear All Caches
```bash
# Clear Next.js cache
rm -rf .next

# Clear npm cache
npm cache clean --force

# Clear bun cache
bun pm cache rm

# Reinstall dependencies
bun install
```

### Reset Development Environment
```bash
# Stop dev server
# Clear caches
rm -rf .next node_modules/.cache

# Reset database (if using local)
# Reinstall and restart
bun install
bun dev
```

### Emergency Build Fix
```bash
# Force clean build
rm -rf .next out
NODE_OPTIONS="--max-old-space-size=4096" bun run build
```

## Getting Help

### Debug Mode
```bash
# Enable debug logging
DEBUG=* bun dev

# Build with verbose output
bun run build --verbose
```

### Common Logs to Check
1. Browser console for client errors
2. Terminal for build/server errors
3. Network tab for API failures
4. Database logs for query issues

### Support Resources
1. Next.js documentation
2. Supabase documentation
3. Alpaca Markets API docs
4. Project issue tracker
