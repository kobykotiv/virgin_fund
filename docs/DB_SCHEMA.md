# MongoDB Schema Design

## Collections Overview

### users
```typescript
{
  _id: ObjectId,
  email: string,
  name: string,
  role: "user" | "admin" | "demo",
  authProvider: "email" | "google" | "github",
  hashedPassword?: string,
  profile: {
    avatar?: string,
    timezone: string,
    language: string,
    preferences: {
      theme: "light" | "dark" | "system",
      notifications: boolean,
      emailFrequency: "daily" | "weekly" | "never"
    }
  },
  trading: {
    defaultStrategy: ObjectId,
    riskLevel: "conservative" | "moderate" | "aggressive",
    maxDrawdown: number,
    tradingEnabled: boolean,
    automationEnabled: boolean
  },
  subscription: {
    plan: "free" | "pro" | "enterprise",
    status: "active" | "expired" | "cancelled",
    features: string[],
    validUntil: Date,
    billingCycle: "monthly" | "annual",
    price: number,
    currency: string
  },
  apiConnections: [{
    provider: string,
    name: string,
    status: "active" | "inactive" | "error",
    credentials: {
      encryptedApiKey: string,
      encryptedSecretKey: string,
      passphrase?: string
    },
    permissions: string[],
    metadata: object
  }],
  usage: {
    lastLogin: Date,
    loginCount: number,
    totalTrades: number,
    tradingVolume: number,
    apiCallCount: number
  },
  metadata: object,
  createdAt: Date,
  updatedAt: Date
}
```

### user_activities
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  type: "login" | "trade" | "bot_action" | "settings_change" | "subscription_change",
  timestamp: Date,
  metadata: {
    ip?: string,
    userAgent?: string,
    location?: string,
    details: object
  }
}
```

### user_notifications
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  type: "alert" | "trade" | "system" | "subscription",
  status: "unread" | "read" | "archived",
  priority: "low" | "medium" | "high",
  title: string,
  message: string,
  metadata: object,
  createdAt: Date,
  readAt?: Date
}
```

### trading_bots
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  name: string,
  type: "dca" | "grid" | "momentum",
  config: {
    pairs: string[],
    interval: string,
    strategy: object,
    riskManagement: {
      stopLoss: number,
      takeProfit: number
    }
  },
  performance: {
    totalPnL: number,
    winRate: number,
    trades: number
  },
  isPublic: boolean,
  status: "active" | "paused" | "error",
  lastRun: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### strategies
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  name: string, 
  description: string,
  type: "custom" | "template",
  rules: [{
    condition: string,
    action: string,
    parameters: object
  }],
  backtestResults: {
    winRate: number,
    profitFactor: number,
    maxDrawdown: number,
    data: object
  },
  isPublic: boolean,
  versions: [{
    version: string,
    changes: string[],
    timestamp: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Indexing Strategy

### Users Collection
- `email`: unique index
- `"authProvider"`: standard index
- `"subscription.status"`: standard index
- `"apiConnections.status"`: standard index
- `updatedAt`: TTL index

### User Activities Collection
- `userId`: standard index
- `type`: standard index
- `timestamp`: TTL index (expire after 90 days)

### User Notifications Collection
- `userId`: standard index
- `status`: standard index
- `createdAt`: TTL index (expire after 30 days)

### Trading Bots Collection  
- `userId`: standard index
- `isPublic`: standard index
- `status`: standard index

### Strategies Collection
- `userId`: standard index
- `isPublic`: standard index
- `type`: standard index

## Data Relationships

1. One-to-Many: User -> Trading Bots
2. One-to-Many: User -> Strategies  
3. Many-to-One: Trading Bot -> Strategy

## Validation Rules

1. User email must be unique
2. Bot names must be unique per user
3. Strategy names must be unique per user

## Migration Strategy

1. Version documents using timestamps
2. Maintain backwards compatibility
3. Use rolling updates for schema changes
