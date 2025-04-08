type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error'
type ConnectionListener = (status: ConnectionStatus) => void

export class ConnectionManager {
  private static instance: ConnectionManager
  private ws: WebSocket | null = null
  private status: ConnectionStatus = 'disconnected'
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private baseDelay = 1000 // 1 second
  private maxDelay = 30000 // 30 seconds
  private listeners: Set<ConnectionListener> = new Set()
  private reconnectTimeout?: NodeJS.Timeout

  private constructor(private wsUrl: string) {
    this.setupOfflineDetection()
  }

  static getInstance(wsUrl: string): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager(wsUrl)
    }
    return ConnectionManager.instance
  }

  connect(): void {
    if (this.status === 'connecting') return
    
    this.setStatus('connecting')
    
    try {
      this.ws = new WebSocket(this.wsUrl)
      
      this.ws.onopen = () => {
        this.reconnectAttempts = 0
        this.setStatus('connected')
      }

      this.ws.onclose = () => {
        this.setStatus('disconnected')
        this.scheduleReconnect()
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.setStatus('error')
        this.ws?.close()
      }

    } catch (error) {
      console.error('Connection error:', error)
      this.setStatus('error')
      this.scheduleReconnect()
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      return
    }

    const delay = Math.min(
      this.baseDelay * Math.pow(2, this.reconnectAttempts),
      this.maxDelay
    )

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts++
      this.connect()
    }, delay)
  }

  private setupOfflineDetection(): void {
    window.addEventListener('online', () => {
      console.log('Network online')
      this.connect()
    })

    window.addEventListener('offline', () => {
      console.log('Network offline')
      this.setStatus('disconnected')
    })
  }

  private setStatus(status: ConnectionStatus): void {
    this.status = status
    this.notifyListeners()
  }

  addListener(listener: ConnectionListener): void {
    this.listeners.add(listener)
  }

  removeListener(listener: ConnectionListener): void {
    this.listeners.delete(listener)
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.status))
  }

  getStatus(): ConnectionStatus {
    return this.status
  }

  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
    }
    this.ws?.close()
    this.setStatus('disconnected')
  }
}
