---
applyTo: '**/*.{ts,tsx,js,jsx}'
---

# Virgin Fund - PaaS Architecture Patterns

## Platform as a Service Design Principles

### Core Platform Tenets
1. **User-Centric Design**: Every feature serves the trader's workflow
2. **Real-Time Experience**: Live data synchronization is core to the platform
3. **Scalable Infrastructure**: Built to handle thousands of concurrent users
4. **Reliable Operations**: 99.9% uptime with comprehensive error handling
5. **Secure by Default**: Enterprise-grade security for financial data

### Platform Architecture Layers

#### 1. Frontend Layer (PaaS Interface)
```
User Interface (Next.js 15)
├── Platform Components    # Core trading interface
├── Real-time Updates      # Live market data
├── Progressive Enhancement # Offline capabilities
├── Responsive Design      # Cross-device compatibility
└── Accessibility          # WCAG compliant
```

#### 2. Backend as a Service (Supabase)
```
Supabase BaaS Infrastructure
├── PostgreSQL Database    # Primary data store
├── Real-time Engine       # WebSocket subscriptions
├── Authentication         # User management & OAuth
├── Edge Functions         # Serverless compute
└── Storage               # File & asset management
```

#### 3. Integration Layer
```
External Service Integrations
├── Alpaca Markets         # Trading execution
├── Market Data Providers  # Real-time quotes
├── Payment Processors     # Subscription billing
└── Analytics Platforms   # Usage tracking
```

## PaaS Development Patterns

### Real-Time Data Patterns

#### Supabase Real-Time Subscriptions
```typescript
// Platform hook for real-time bot updates
export function useBotRealtime(botId: string) {
  const [bot, setBot] = useState<Bot | null>(null)
  
  useEffect(() => {
    const channel = supabase
      .channel(`bot-${botId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bots',
        filter: `id=eq.${botId}`
      }, (payload) => {
        setBot(payload.new as Bot)
      })
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [botId])
  
  return bot
}
```

#### Optimistic Updates with Rollback
```typescript
// Platform pattern for optimistic updates
export async function updateBotPosition(
  botId: string, 
  positionId: string, 
  updates: Partial<Position>
) {
  // Store original state for rollback
  const originalPosition = await getPosition(positionId)
  
  // Optimistic update
  updatePositionCache(positionId, { ...originalPosition, ...updates })
  
  try {
    // Real API call
    const { data, error } = await supabase
      .from('positions')
      .update(updates)
      .eq('id', positionId)
      .eq('bot_id', botId)
    
    if (error) throw error
    
    // Update with server response
    updatePositionCache(positionId, data)
  } catch (error) {
    // Rollback on failure
    updatePositionCache(positionId, originalPosition)
    throw error
  }
}
```

### Platform State Management

#### Global Platform Context
```typescript
// Platform context for user session and preferences
interface PlatformContextType {
  user: User | null
  preferences: UserPreferences
  theme: 'light' | 'dark' | 'auto'
  isOnline: boolean
  realtimeStatus: 'connected' | 'connecting' | 'disconnected'
}

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [context, setContext] = useState<PlatformContextType>({
    user: null,
    preferences: defaultPreferences,
    theme: 'auto',
    isOnline: navigator.onLine,
    realtimeStatus: 'connecting'
  })
  
  // Platform initialization logic
  useEffect(() => {
    initializePlatform()
  }, [])
  
  return (
    <PlatformContext.Provider value={{ context, setContext }}>
      {children}
    </PlatformContext.Provider>
  )
}
```

### Error Handling Patterns

#### Platform Error Boundary
```typescript
// Platform-wide error boundary
export class PlatformErrorBoundary extends Component {
  state = { hasError: false, error: null }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to platform monitoring
    logPlatformError(error, errorInfo)
    
    // Report to user monitoring service
    reportError(error, {
      componentStack: errorInfo.componentStack,
      userId: getCurrentUser()?.id,
      platformVersion: getPlatformVersion()
    })
  }
  
  render() {
    if (this.state.hasError) {
      return <PlatformErrorFallback error={this.state.error} />
    }
    
    return this.props.children
  }
}
```

#### Platform API Patterns

#### Standardized API Responses
```typescript
// Platform API response format
export interface PlatformResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    timestamp: string
    requestId: string
    pagination?: {
      page: number
      limit: number
      total: number
    }
  }
}

// Platform API utility
export async function platformApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<PlatformResponse<T>> {
  try {
    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers
      }
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new PlatformError(data.error?.message || 'API Error', {
        status: response.status,
        code: data.error?.code
      })
    }
    
    return {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: generateRequestId()
      }
    }
  } catch (error) {
    return {
      success: false,
      error: {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message || 'An unexpected error occurred'
      }
    }
  }
}
```

### Caching Strategies

#### Multi-Layer Caching
```typescript
// Platform caching strategy
export class PlatformCache {
  private memoryCache = new Map<string, CachedItem>()
  private redisClient: Redis | null = null
  
  constructor() {
    this.initializeRedis()
  }
  
  async get<T>(key: string): Promise<T | null> {
    // Check memory cache first
    const memoryItem = this.memoryCache.get(key)
    if (memoryItem && !this.isExpired(memoryItem)) {
      return memoryItem.data as T
    }
    
    // Check Redis cache
    if (this.redisClient) {
      const redisItem = await this.redisClient.get(key)
      if (redisItem) {
        const parsed = JSON.parse(redisItem)
        if (!this.isExpired(parsed)) {
          // Update memory cache
          this.memoryCache.set(key, parsed)
          return parsed.data as T
        }
      }
    }
    
    return null
  }
  
  async set<T>(
    key: string, 
    data: T, 
    ttl: number = 300000 // 5 minutes
  ): Promise<void> {
    const item: CachedItem = {
      data,
      expiresAt: Date.now() + ttl
    }
    
    // Set in memory
    this.memoryCache.set(key, item)
    
    // Set in Redis
    if (this.redisClient) {
      await this.redisClient.setex(key, ttl / 1000, JSON.stringify(item))
    }
  }
}
```

### Security Patterns

#### Row Level Security (RLS) Policies
```sql
-- Platform RLS policy for user data isolation
ALTER TABLE bots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own bots" ON bots
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their bot's positions" ON positions
  FOR ALL USING (
    bot_id IN (
      SELECT id FROM bots WHERE user_id = auth.uid()
    )
  );
```

#### API Rate Limiting
```typescript
// Platform rate limiting
export class PlatformRateLimiter {
  private attempts = new Map<string, number[]>()
  
  isAllowed(identifier: string, limit: number, window: number): boolean {
    const now = Date.now()
    const windowStart = now - window
    
    // Get existing attempts
    const userAttempts = this.attempts.get(identifier) || []
    
    // Remove old attempts outside the window
    const validAttempts = userAttempts.filter(time => time > windowStart)
    
    // Check if under limit
    if (validAttempts.length < limit) {
      validAttempts.push(now)
      this.attempts.set(identifier, validAttempts)
      return true
    }
    
    return false
  }
  
  getRemainingTime(identifier: string, window: number): number {
    const attempts = this.attempts.get(identifier) || []
    if (attempts.length === 0) return 0
    
    const oldestAttempt = Math.min(...attempts)
    return Math.max(0, (oldestAttempt + window) - Date.now())
  }
}
```

### Performance Optimization

#### Code Splitting Strategy
```typescript
// Platform code splitting
const TradingDashboard = lazy(() => import('../components/trading/TradingDashboard'))
const BacktestInterface = lazy(() => import('../components/backtest/BacktestInterface'))
const AnalyticsDashboard = lazy(() => import('../components/analytics/AnalyticsDashboard'))

// Route-based code splitting
export function PlatformRoutes() {
  return (
    <Suspense fallback={<PlatformLoadingSpinner />}>
      <Routes>
        <Route path="/trading" element={<TradingDashboard />} />
        <Route path="/backtest" element={<BacktestInterface />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
      </Routes>
    </Suspense>
  )
}
```

#### Virtual Scrolling for Large Datasets
```typescript
// Platform virtual scrolling for large position lists
export function VirtualPositionList({ positions }: { positions: Position[] }) {
  const parentRef = useRef<HTMLDivElement>(null)
  
  const rowVirtualizer = useVirtualizer({
    count: positions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60, // Estimated row height
    overscan: 5
  })
  
  return (
    <div ref={parentRef} className="platform-virtual-list">
      <div 
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
        className="platform-virtual-list-inner"
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => (
          <PositionRow
            key={virtualItem.key}
            position={positions[virtualItem.index]}
            style={{
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`
            }}
          />
        ))}
      </div>
    </div>
  )
}
```

### Testing Patterns

#### Platform Integration Tests
```typescript
// Platform integration test pattern
describe('Trading Platform Integration', () => {
  let testUser: User
  let testBot: Bot
  
  beforeAll(async () => {
    // Setup test user and bot
    testUser = await createTestUser()
    testBot = await createTestBot(testUser.id)
  })
  
  it('should execute trade through full platform flow', async () => {
    // 1. Login user
    await loginTestUser(testUser)
    
    // 2. Create trading signal
    const signal = await createTestSignal(testBot.id)
    
    // 3. Execute trade via Alpaca
    const order = await executeTestTrade(signal)
    
    // 4. Verify order in database
    const savedOrder = await getOrderFromDatabase(order.id)
    expect(savedOrder.status).toBe('filled')
    
    // 5. Verify real-time update
    await waitForRealtimeUpdate(savedOrder.id)
  })
  
  afterAll(async () => {
    // Cleanup test data
    await cleanupTestData(testUser.id)
  })
})
```

This document outlines the core architectural patterns and best practices for developing Virgin Fund as a Platform as a Service. These patterns ensure scalability, reliability, and maintainability of the trading platform.
