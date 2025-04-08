interface WebSocketMessage {
  id: string
  type: string
  payload: any
  timestamp: number
  priority: number
  sent: boolean
  confirmed: boolean
}

export class WebSocketQueue {
  private static instance: WebSocketQueue
  private ws: WebSocket | null = null
  private queue: WebSocketMessage[] = []
  private reconnectAttempts = 0
  private maxReconnectAttempts = 10
  private reconnectTimeout: NodeJS.Timeout | null = null
  private messageConfirmationTimeout = 5000 // ms
  private listeners: Map<string, Set<(data: any) => void>> = new Map()
  private confirmationListeners: Map<string, (confirmed: boolean) => void> = new Map()

  private constructor(private wsUrl: string) {}

  static getInstance(wsUrl?: string): WebSocketQueue {
    if (!WebSocketQueue.instance && wsUrl) {
      WebSocketQueue.instance = new WebSocketQueue(wsUrl)
    }
    
    if (!WebSocketQueue.instance) {
      throw new Error('WebSocketQueue not initialized. Provide wsUrl on first call.')
    }
    
    return WebSocketQueue.instance
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve()
        return
      }

      try {
        this.ws = new WebSocket(this.wsUrl)
        
        this.ws.onopen = () => {
          console.log('WebSocket connected')
          this.reconnectAttempts = 0
          this.processQueue()
          resolve()
        }

        this.ws.onclose = () => {
          console.log('WebSocket disconnected')
          this.scheduleReconnect()
        }

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          reject(error)
        }

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            
            // Handle message confirmations
            if (data.type === 'confirmation' && data.messageId) {
              const callback = this.confirmationListeners.get(data.messageId)
              if (callback) {
                callback(true)
                this.confirmationListeners.delete(data.messageId)
              }
              
              // Mark as confirmed in queue
              const message = this.queue.find(m => m.id === data.messageId)
              if (message) {
                message.confirmed = true
              }
            }
            
            // Notify type-specific listeners
            const typeListeners = this.listeners.get(data.type)
            if (typeListeners) {
              typeListeners.forEach(callback => callback(data))
            }
            
            // Notify global listeners
            const globalListeners = this.listeners.get('*')
            if (globalListeners) {
              globalListeners.forEach(callback => callback(data))
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error)
          }
        }
      } catch (error) {
        console.error('Error creating WebSocket:', error)
        this.scheduleReconnect()
        reject(error)
      }
    })
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
    }
    
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn('Max WebSocket reconnection attempts reached')
      return
    }
    
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000)
    this.reconnectAttempts++
    
    this.reconnectTimeout = setTimeout(() => {
      console.log(`Reconnecting WebSocket (attempt ${this.reconnectAttempts})...`)
      this.connect().catch(() => {
        // Error is already logged in connect()
      })
    }, delay)
  }

  send(type: string, payload: any, priority: number = 1): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const messageId = Math.random().toString(36).substring(2, 9)
      
      // Add to queue
      const message: WebSocketMessage = {
        id: messageId,
        type,
        payload,
        timestamp: Date.now(),
        priority,
        sent: false,
        confirmed: false
      }
      
      this.queue.push(message)
      
      // Sort by priority (higher first) and then by timestamp (older first)
      this.queue.sort((a, b) => {
        if (a.priority !== b.priority) return b.priority - a.priority
        return a.timestamp - b.timestamp
      })
      
      // Set up confirmation listener with timeout
      this.confirmationListeners.set(messageId, (confirmed) => {
        if (confirmed) {
          resolve(true)
        }
      })
      
      // Set up timeout for confirmation
      setTimeout(() => {
        if (this.confirmationListeners.has(messageId)) {
          this.confirmationListeners.delete(messageId)
          
          // Re-queue message for retry if not confirmed
          const message = this.queue.find(m => m.id === messageId)
          if (message && !message.confirmed) {
            message.sent = false
            this.processQueue()
          }
          
          reject(new Error('WebSocket message confirmation timeout'))
        }
      }, this.messageConfirmationTimeout)
      
      // Process queue immediately
      this.processQueue()
    })
  }

  processQueue(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      // Not connected, try to connect first
      this.connect().catch(() => {
        // Error is already logged in connect()
      })
      return
    }
    
    // Process unsent messages
    const unsent = this.queue.filter(msg => !msg.sent && !msg.confirmed)
    
    for (const message of unsent) {
      try {
        this.ws.send(JSON.stringify({
          messageId: message.id,
          type: message.type,
          data: message.payload,
          timestamp: message.timestamp
        }))
        
        message.sent = true
      } catch (error) {
        console.error('Error sending WebSocket message:', error)
        break
      }
    }
    
    // Clean up confirmed messages
    this.queue = this.queue.filter(msg => !msg.confirmed)
  }

  subscribe(type: string, callback: (data: any) => void): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set())
    }
    
    this.listeners.get(type)!.add(callback)
  }

  unsubscribe(type: string, callback: (data: any) => void): void {
    const listeners = this.listeners.get(type)
    if (listeners) {
      listeners.delete(callback)
      if (listeners.size === 0) {
        this.listeners.delete(type)
      }
    }
  }

  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }
    
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  getQueueLength(): number {
    return this.queue.length
  }

  getPendingMessagesCount(): number {
    return this.queue.filter(msg => !msg.confirmed).length
  }
}
