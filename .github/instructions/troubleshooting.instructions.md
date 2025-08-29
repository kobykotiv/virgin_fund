---
applyTo: '**/*.{ts,tsx,js,jsx,json,md}'
---

# Virgin Fund - PaaS Troubleshooting Guide

## Platform Health Monitoring

### Platform Status Checks
```bash
# Check overall platform health
curl https://api.virginfund.com/health

# Check Supabase connection
npx supabase status

# Check Alpaca API connectivity
curl https://api.alpaca.markets/v2/account

# Check Redis cache health
redis-cli ping
```

### Real-time Monitoring
- **Supabase Dashboard**: Database performance and connection health
- **Vercel Dashboard**: Frontend deployment and performance metrics
- **Alpaca Dashboard**: API rate limits and trading status
- **Redis Dashboard**: Cache hit rates and memory usage

## Platform Build Errors

### Supabase Schema Conflicts
**Error**: "Migration conflicts detected"
**Platform Solution**:
1. Check current migration status: `npx supabase migration list`
2. Reset local database: `npx supabase db reset`
3. Pull latest schema changes: `npx supabase db pull`
4. Reapply migrations: `npx supabase db push`

### Real-time Subscription Failures
**Error**: "Failed to establish WebSocket connection"
**Platform Solution**:
1. Verify Supabase real-time is enabled
2. Check RLS policies allow subscriptions
3. Validate WebSocket URL configuration
4. Test with Supabase dashboard

### Alpaca API Integration Issues
**Error**: "Alpaca API rate limit exceeded"
**Platform Solution**:
1. Implement exponential backoff retry logic
2. Cache market data to reduce API calls
3. Upgrade Alpaca API plan for higher limits
4. Implement request queuing for burst traffic

## Platform Runtime Errors

### Authentication Failures
**Problem**: Users unable to login to platform
**Platform Checks**:
1. Verify Supabase Auth configuration
2. Check JWT token expiration settings
3. Validate OAuth provider settings
4. Test social login integrations
5. Review RLS policies for user data access

### Trading Execution Failures
**Problem**: Orders failing to execute
**Platform Checks**:
1. Verify Alpaca API credentials
2. Check account permissions and funding
3. Validate order parameters and formats
4. Monitor Alpaca API status and maintenance
5. Review platform rate limiting

### Data Synchronization Issues
**Problem**: Frontend and backend data out of sync
**Platform Solutions**:
1. Implement optimistic updates with rollback
2. Use Supabase real-time subscriptions
3. Add data validation on both client and server
4. Implement conflict resolution strategies
5. Monitor data consistency with checksums

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
