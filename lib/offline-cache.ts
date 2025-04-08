export class OfflineCache {
  private static instance: OfflineCache
  private cache: Map<string, { data: any; timestamp: number }>
  private maxAge: number // milliseconds

  private constructor() {
    this.cache = new Map()
    this.maxAge = 1000 * 60 * 60 // 1 hour default
    this.loadFromStorage()
  }

  static getInstance(): OfflineCache {
    if (!OfflineCache.instance) {
      OfflineCache.instance = new OfflineCache()
    }
    return OfflineCache.instance
  }

  set(key: string, data: any, maxAge?: number): void {
    const timestamp = Date.now()
    this.cache.set(key, { data, timestamp })
    this.saveToStorage()
  }

  get<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    const age = Date.now() - cached.timestamp
    if (age > this.maxAge) {
      this.cache.delete(key)
      this.saveToStorage()
      return null
    }

    return cached.data as T
  }

  private saveToStorage(): void {
    try {
      const data = Object.fromEntries(this.cache)
      localStorage.setItem('offline_cache', JSON.stringify(data))
    } catch (error) {
      console.error('Error saving to storage:', error)
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('offline_cache')
      if (stored) {
        const data = JSON.parse(stored)
        this.cache = new Map(Object.entries(data))
        
        // Clean expired items
        for (const [key, value] of this.cache.entries()) {
          if (Date.now() - value.timestamp > this.maxAge) {
            this.cache.delete(key)
          }
        }
      }
    } catch (error) {
      console.error('Error loading from storage:', error)
    }
  }

  clear(): void {
    this.cache.clear()
    localStorage.removeItem('offline_cache')
  }
}
