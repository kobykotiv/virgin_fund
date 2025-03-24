# Virgin Fund MVP Setup Guide

## Prerequisites
- Node.js 18+
- PostgreSQL 14+
- pnpm (recommended) or npm

## Step 1: Initial Setup

```bash
# Create project
pnpm create next-app virgin_fund --typescript --tailwind --app
cd virgin_fund

# Install dependencies
pnpm add @prisma/client @auth/prisma-adapter @auth/core next-auth
pnpm add -D prisma typescript @types/node @types/react

# Initialize Prisma
pnpm prisma init
```

## Step 2: Environment Setup

Create `.env` file:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/virgin_fund"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

## Step 3: Database Setup

```bash
# Run migrations
pnpm prisma migrate dev
# Generate Prisma Client
pnpm prisma generate
```

## Step 4: Core Features Implementation

### Minimum Features for MVP:
1. User Authentication and Provider Registration
2. Bot Creation and Rental System
3. Portfolio and Position Tracking
4. Copy Trading Framework
5. Basic Payment Processing
6. Performance Monitoring

### Implementation Order:

1. **Authentication and User System**
   - User/Provider registration
   - API key management
   - Wallet setup

2. **Bot Management**
   - Bot creation and configuration
   - Rental system implementation
   - Performance tracking

3. **Trading Features**
   - Copy trading system
   - Portfolio management
   - Position tracking

4. **Payment System**
   - Payment processing
   - Provider payouts
   - Commission handling

## Step 5: Testing

```bash
# Run development server
pnpm dev
```

## Project Structure

```
virgin_fund/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (protected)/
│   │   ├── portfolio/
│   │   │   └── page.tsx
│   │   └── bots/
│   │       ├── [id]/
│   │       │   ├── page.tsx
│   │       │   └── edit/
│   │       │       └── page.tsx
│   │       └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── portfolio/
│   │   │   └── route.ts
│   │   └── bots/
│   │       └── route.ts
│   ├── page.tsx
│   └── layout.tsx
├── components/
│   ├── auth/
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   ├── portfolio/
│   │   └── portfolio-view.tsx
│   └── bots/
│       └── bot-list.tsx
|---src/
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   └── utils.ts
├── types/
│   └── index.ts
├── prisma/
│   └── schema.prisma
└── public/

```

## Core Routes:

- `/` - Dashboard
- `/portfolio` - Portfolio management
- `/bots` - Bot management
- `/api/portfolio` - Portfolio API
- `/api/bots` - Bots API

## Deployment Checklist:

1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Build and deploy application
5. Set up monitoring

## Next Steps After MVP:

1. Add real-time updates
2. Implement advanced bot features
3. Add social features
4. Enhance UI/UX
5. Add analytics
