import { OfflineCache } from './offline-cache'
import { DEMO_ACCOUNTS } from './demo-data'

type SyncStatus = 'idle' | 'syncing' | 'error' | 'success'

interface SyncQueueItem {
  id: string
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  timestamp: number
  retries: number
}

export class SyncManager {
  private static instance: SyncManager
  private queue: SyncQueueItem[] = []
  private status: SyncStatus = 'idle'
  private cache: OfflineCache
  private syncInterval: NodeJS.Timeout | null = null
  private maxRetries = 5
  private listeners: Set<(status: SyncStatus) => void> = new Set()

  private constructor() {
    this.cache = OfflineCache.getInstance()
    this.loadQueue()
    this.setupNetworkListeners()
  }

  static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager()
    }
    return SyncManager.instance
  }

  private setupNetworkListeners(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.processQueue()
      })

      window.addEventListener('offline', () => {
        this.setStatus('idle')
        if (this.syncInterval) {
          clearInterval(this.syncInterval)
          this.syncInterval = null
        }
      })
    }
  }

  addToQueue(item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'retries'>): void {
    const queueItem: SyncQueueItem = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      retries: 0,
      ...item
    }
    
    this.queue.push(queueItem)
    this.saveQueue()
    
    if (navigator.onLine) {
      this.processQueue()
    }
  }

  async processQueue(): Promise<void> {
    if (this.status === 'syncing' || this.queue.length === 0) return
    
    this.setStatus('syncing')
    
    const item = this.queue[0]
    
    try {
      const response = await fetch(item.endpoint, {
        method: item.method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: item.data ? JSON.stringify(item.data) : undefined
      })
      
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }
      
      // Request succeeded, remove from queue
      this.queue.shift()
      this.saveQueue()
      
      // Process next item if any
      if (this.queue.length > 0) {
        this.processQueue()
      } else {
        this.setStatus('success')
      }
    } catch (error) {
      console.error('Sync error:', error)
      
      // Increment retry count
      item.retries++
      this.saveQueue()
      
      if (item.retries >= this.maxRetries) {
        // Remove from queue after max retries
        this.queue.shift()
        this.saveQueue()
      }
      
      this.setStatus('error')
      
      // Wait before next attempt
      setTimeout(() => {
        if (this.queue.length > 0 && navigator.onLine) {
          this.processQueue()
        }
      }, this.getBackoffTime(item.retries))
    }
  }

  private getBackoffTime(retries: number): number {
    // Exponential backoff with jitter
    const baseDelay = 1000
    const maxDelay = 30000
    const expBackoff = Math.min(baseDelay * Math.pow(2, retries), maxDelay)
    const jitter = Math.random() * 0.3 * expBackoff
    
    return expBackoff + jitter
  }

  private saveQueue(): void {
    localStorage.setItem('sync_queue', JSON.stringify(this.queue))
  }

  private loadQueue(): void {
    try {
      const saved = localStorage.getItem('sync_queue')
      if (saved) {
        this.queue = JSON.parse(saved)
      }
    } catch (error) {
      console.error('Error loading sync queue:', error)
      this.queue = []
    }
  }

  private setStatus(status: SyncStatus): void {
    this.status = status
    this.notifyListeners()
  }

  addListener(callback: (status: SyncStatus) => void): void {
    this.listeners.add(callback)
  }

  removeListener(callback: (status: SyncStatus) => void): void {
    this.listeners.delete(callback)
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.status))
  }

  getStatus(): SyncStatus {
    return this.status
  }

  getQueueLength(): number {
    return this.queue.length
  }

  startPeriodicSync(intervalMs: number = 60000): void {
    if (this.syncInterval) clearInterval(this.syncInterval)
    
    this.syncInterval = setInterval(() => {
      if (navigator.onLine && this.queue.length > 0) {
        this.processQueue()
      }
    }, intervalMs)
  }

  stopPeriodicSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
  }
}
