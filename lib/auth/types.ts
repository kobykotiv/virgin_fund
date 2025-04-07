// Database types
export type DatabaseType = 'sql' | 'nosql'

// Base user interface
export interface BaseUser {
  id: string
  email: string
  name?: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

// SQL (Supabase) specific user
export interface SqlUser extends BaseUser {
  aud: string
  role?: string
  lastSignInAt?: Date
  databaseType: 'sql'
}

// NoSQL (MongoDB) specific user
export interface NoSqlUser extends BaseUser {
  preferences?: Record<string, unknown>
  lastActive?: Date
  databaseType: 'nosql'
}

// Combined user type
export type User = SqlUser | NoSqlUser

// Authentication session
export interface AuthSession {
  user: User | null
  accessToken?: string
  refreshToken?: string
  expiresAt?: Date
  databaseType: DatabaseType
}

// Auth response type
export interface AuthResponse {
  session: AuthSession | null
  error: Error | null
}

// Demo user extension
export interface DemoUser extends BaseUser {
  isDemoAccount: true
  demoScenario: string
}

// Auth configuration
export interface AuthConfig {
  preferredDatabase: DatabaseType
  providers: {
    sql: {
      enabled: boolean
      endpoint?: string
    }
    nosql: {
      enabled: boolean
      endpoint?: string
    }
  }
}

// Auth context interface
export interface AuthContextType {
  user: User | null
  session: AuthSession | null
  isLoading: boolean
  error: Error | null
  login: (email: string, password: string, dbType?: DatabaseType) => Promise<AuthResponse>
  logout: () => Promise<void>
  signup: (email: string, password: string, data: Partial<User>) => Promise<AuthResponse>
  refresh: () => Promise<void>
  enableDemoMode: () => Promise<void>
  databaseType: DatabaseType
}

// User operations
export type UserOperation = 
  | { type: 'UPDATE'; payload: Partial<User> }
  | { type: 'DELETE' }
  | { type: 'LOGOUT' }

// Database connection status
export interface DatabaseStatus {
  sql: {
    connected: boolean
    lastChecked: Date
  }
  nosql: {
    connected: boolean
    lastChecked: Date
  }
  preferred: DatabaseType
}

// Database provider interfaces
export interface DatabaseProvider {
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  isConnected: () => boolean
  getStatus: () => DatabaseStatus
}

// Asset types
export interface Asset {
  id: string
  symbol: string
  name: string
  type: 'stock' | 'crypto' | 'forex' | 'commodity'
  currentPrice?: number
  lastUpdated?: Date
}

// Portfolio types
export interface Portfolio {
  id: string
  userId: string
  name: string
  description?: string
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Very High'
  isDemo: boolean
  holdings: PortfolioHolding[]
  createdAt: Date
  updatedAt: Date
}

export interface PortfolioHolding {
  assetId: string
  quantity: number
  costBasis: number
}

// Transaction types
export interface Transaction {
  id: string
  portfolioId: string
  assetId: string
  type: 'buy' | 'sell'
  quantity: number
  price: number
  timestamp: Date
}

// Database record types
export interface DatabaseRecord {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface SqlRecord extends DatabaseRecord {
  tableId: string
  schemaVersion: number
}

export interface NoSqlRecord extends DatabaseRecord {
  collection: string
  docVersion: number
}
