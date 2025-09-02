import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './use-auth'
import { useToast } from './use-toast'

interface AlpacaCredentials {
  keyId: string
  secretKey: string
  baseUrl: string
  isPaper: boolean
}

interface AlpacaAccount {
  id: string
  account_number: string
  status: string
  currency: string
  buying_power: string
  regt_buying_power: string
  daytrading_buying_power: string
  cash: string
  portfolio_value: string
  maintenance_margin: string
  last_maintenance_margin: string
  daytrade_count: number
}

interface AlpacaPosition {
  asset_id: string
  symbol: string
  exchange: string
  asset_class: string
  avg_entry_price: string
  qty: string
  side: string
  market_value: string
  cost_basis: string
  unrealized_pl: string
  unrealized_plpc: string
  unrealized_intraday_pl: string
  unrealized_intraday_plpc: string
  current_price: string
  lastday_price: string
  change_today: string
}

interface AlpacaOrder {
  id: string
  client_order_id: string
  created_at: string
  updated_at: string
  submitted_at?: string
  filled_at?: string
  expired_at?: string
  canceled_at?: string
  failed_at?: string
  replaced_at?: string
  replaced_by?: string
  replaces?: string
  asset_id: string
  symbol: string
  asset_class: string
  qty: string
  filled_qty: string
  type: string
  side: string
  time_in_force: string
  limit_price?: string
  stop_price?: string
  filled_avg_price?: string
  status: string
}

interface UseAlpacaConnectReturn {
  // Connection state
  isConnected: boolean
  isConnecting: boolean
  credentials: AlpacaCredentials | null

  // Account data
  account: AlpacaAccount | null
  positions: AlpacaPosition[]
  orders: AlpacaOrder[]

  // Connection methods
  connect: (credentials: AlpacaCredentials) => Promise<void>
  disconnect: () => Promise<void>
  validateCredentials: (credentials: AlpacaCredentials) => Promise<boolean>

  // Data fetching methods
  fetchAccount: () => Promise<void>
  fetchPositions: () => Promise<void>
  fetchOrders: (status?: string) => Promise<void>

  // Trading methods
  placeOrder: (order: {
    symbol: string
    qty: number
    side: 'buy' | 'sell'
    type: 'market' | 'limit' | 'stop' | 'stop_limit'
    time_in_force: 'day' | 'gtc' | 'opg' | 'cls' | 'ioc' | 'fok'
    limit_price?: number
    stop_price?: number
  }) => Promise<AlpacaOrder>

  cancelOrder: (orderId: string) => Promise<void>

  // Error handling
  error: string | null
  clearError: () => void
}

export function useAlpacaConnect(): UseAlpacaConnectReturn {
  const { isDemoMode } = useAuth()
  const { toast } = useToast()

  // State
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [credentials, setCredentials] = useState<AlpacaCredentials | null>(null)
  const [account, setAccount] = useState<AlpacaAccount | null>(null)
  const [positions, setPositions] = useState<AlpacaPosition[]>([])
  const [orders, setOrders] = useState<AlpacaOrder[]>([])
  const [error, setError] = useState<string | null>(null)

  // Load saved credentials on mount
  useEffect(() => {
    const savedCredentials = localStorage.getItem('alpaca_credentials')
    if (savedCredentials) {
      try {
        const creds = JSON.parse(savedCredentials)
        setCredentials(creds)
        // Auto-connect if we have saved credentials
        connect(creds)
      } catch (err) {
        console.error('Error parsing saved credentials:', err)
        localStorage.removeItem('alpaca_credentials')
      }
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const validateCredentials = useCallback(async (creds: AlpacaCredentials): Promise<boolean> => {
    try {
      const response = await fetch('/api/alpaca/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(creds),
      })

      return response.ok
    } catch (err) {
      console.error('Error validating credentials:', err)
      return false
    }
  }, [])

  const connect = useCallback(async (creds: AlpacaCredentials) => {
    setIsConnecting(true)
    setError(null)

    try {
      // Validate credentials first
      const isValid = await validateCredentials(creds)
      if (!isValid) {
        throw new Error('Invalid Alpaca credentials')
      }

      // Save credentials
      setCredentials(creds)
      localStorage.setItem('alpaca_credentials', JSON.stringify(creds))

      // Fetch initial data
      await Promise.all([
        fetchAccount(),
        fetchPositions(),
        fetchOrders()
      ])

      setIsConnected(true)

      toast({
        title: "Connected to Alpaca",
        description: `Successfully connected to ${creds.isPaper ? 'Paper' : 'Live'} account`,
        variant: "success"
      })

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to Alpaca'
      setError(errorMessage)

      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsConnecting(false)
    }
  }, [validateCredentials, toast])

  const disconnect = useCallback(async () => {
    try {
      // Clear stored credentials
      localStorage.removeItem('alpaca_credentials')

      // Reset state
      setCredentials(null)
      setAccount(null)
      setPositions([])
      setOrders([])
      setIsConnected(false)
      setError(null)

      toast({
        title: "Disconnected",
        description: "Successfully disconnected from Alpaca",
      })

    } catch (err) {
      console.error('Error disconnecting:', err)
    }
  }, [toast])

  const fetchAccount = useCallback(async () => {
    if (!credentials) return

    try {
      const response = await fetch('/api/alpaca/account', {
        method: 'GET',
        headers: {
          'X-Alpaca-Key-Id': credentials.keyId,
          'X-Alpaca-Secret-Key': credentials.secretKey,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch account data')
      }

      const accountData = await response.json()
      setAccount(accountData)
    } catch (err) {
      console.error('Error fetching account:', err)
      setError('Failed to fetch account data')
    }
  }, [credentials])

  const fetchPositions = useCallback(async () => {
    if (!credentials) return

    try {
      const response = await fetch('/api/alpaca/positions', {
        method: 'GET',
        headers: {
          'X-Alpaca-Key-Id': credentials.keyId,
          'X-Alpaca-Secret-Key': credentials.secretKey,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch positions')
      }

      const positionsData = await response.json()
      setPositions(positionsData)
    } catch (err) {
      console.error('Error fetching positions:', err)
      setError('Failed to fetch positions')
    }
  }, [credentials])

  const fetchOrders = useCallback(async (status?: string) => {
    if (!credentials) return

    try {
      const url = status
        ? `/api/alpaca/orders?status=${status}`
        : '/api/alpaca/orders'

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-Alpaca-Key-Id': credentials.keyId,
          'X-Alpaca-Secret-Key': credentials.secretKey,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const ordersData = await response.json()
      setOrders(ordersData)
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError('Failed to fetch orders')
    }
  }, [credentials])

  const placeOrder = useCallback(async (orderData: {
    symbol: string
    qty: number
    side: 'buy' | 'sell'
    type: 'market' | 'limit' | 'stop' | 'stop_limit'
    time_in_force: 'day' | 'gtc' | 'opg' | 'cls' | 'ioc' | 'fok'
    limit_price?: number
    stop_price?: number
  }): Promise<AlpacaOrder> => {
    if (!credentials) {
      throw new Error('Not connected to Alpaca')
    }

    try {
      const response = await fetch('/api/alpaca/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Alpaca-Key-Id': credentials.keyId,
          'X-Alpaca-Secret-Key': credentials.secretKey,
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to place order')
      }

      const order = await response.json()

      // Refresh orders after placing new order
      await fetchOrders()

      toast({
        title: "Order Placed",
        description: `${orderData.side.toUpperCase()} ${orderData.qty} ${orderData.symbol}`,
        variant: "success"
      })

      return order
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to place order'
      setError(errorMessage)

      toast({
        title: "Order Failed",
        description: errorMessage,
        variant: "destructive"
      })

      throw err
    }
  }, [credentials, fetchOrders, toast])

  const cancelOrder = useCallback(async (orderId: string) => {
    if (!credentials) {
      throw new Error('Not connected to Alpaca')
    }

    try {
      const response = await fetch(`/api/alpaca/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'X-Alpaca-Key-Id': credentials.keyId,
          'X-Alpaca-Secret-Key': credentials.secretKey,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to cancel order')
      }

      // Refresh orders after canceling
      await fetchOrders()

      toast({
        title: "Order Cancelled",
        description: `Order ${orderId} has been cancelled`,
        variant: "success"
      })

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel order'
      setError(errorMessage)

      toast({
        title: "Cancellation Failed",
        description: errorMessage,
        variant: "destructive"
      })

      throw err
    }
  }, [credentials, fetchOrders, toast])

  return {
    // Connection state
    isConnected,
    isConnecting,
    credentials,

    // Account data
    account,
    positions,
    orders,

    // Connection methods
    connect,
    disconnect,
    validateCredentials,

    // Data fetching methods
    fetchAccount,
    fetchPositions,
    fetchOrders,

    // Trading methods
    placeOrder,
    cancelOrder,

    // Error handling
    error,
    clearError,
  }
}
