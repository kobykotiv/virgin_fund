"use client"

import { createContext, useContext, useState, useEffect } from "react"

type PerformanceMetrics = {
  loadTime: number
  timeToInteractive: number
  memoryUsage: number
  pageLoads: number
}

type PerformanceContextType = {
  metrics: PerformanceMetrics
  startTracking: () => void
  stopTracking: () => void
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined)

export function PerformanceProvider({ children }: { children: React.ReactNode }) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    timeToInteractive: 0,
    memoryUsage: 0,
    pageLoads: 0
  })

  const startTracking = () => {
    const start = performance.now()
    
    // Track page load time
    window.addEventListener('load', () => {
      const loadTime = performance.now() - start
      setMetrics(prev => ({ ...prev, loadTime }))
    })

    // Track memory usage if available
    if (performance.memory) {
      setMetrics(prev => ({
        ...prev,
        memoryUsage: performance.memory.usedJSHeapSize / 1048576 // Convert to MB
      }))
    }

    // Track page loads
    setMetrics(prev => ({ ...prev, pageLoads: prev.pageLoads + 1 }))
  }

  const stopTracking = () => {
    // Clean up tracking
  }

  useEffect(() => {
    startTracking()
    return () => stopTracking()
  }, [])

  return (
    <PerformanceContext.Provider value={{ metrics, startTracking, stopTracking }}>
      {children}
    </PerformanceContext.Provider>
  )
}

export function usePerformance() {
  const context = useContext(PerformanceContext)
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider')
  }
  return context
}
