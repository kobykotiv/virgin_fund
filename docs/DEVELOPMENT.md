# Development Guide

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env.local
```

3. Start development server:
```bash
npm run dev
```

## Database Setup

### Local Development
```bash
# Start local database
docker-compose up -d db

# Run migrations
npm run migrate:dev
```

### Production Database
- Use Vercel Postgres or similar
- Run migrations during deployment
- Keep sensitive data in environment variables

## Deployment Process

### Pre-deployment Checklist
- Run full test suite
- Check bundle size
- Verify environment variables
- Review database migrations

### Deploy to Production
```bash
# Build and deploy
npm run build
npm run deploy

# Verify deployment
npm run test:e2e
```

## Development Workflow

### 1. Branch Management
- Create feature branches from `main`
- Use conventional commits
- Submit PRs for review

### 2. Code Quality
Run these before committing:
```bash
npm run lint
npm run test
npm run type-check
```

### 3. Testing
- Write tests for new features
- Update tests for changes
- Maintain >80% coverage

### 4. Documentation
- Update relevant docs
- Include JSDoc comments
- Document breaking changes

## Troubleshooting

### Common Issues

1. Build failures
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

2. Type errors
```bash
# Regenerate TypeScript types
npm run type-check
```
