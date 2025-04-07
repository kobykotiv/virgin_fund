"use client"

import { useState, useEffect } from 'react'

/**
 * Mock Data Warning component
 * 
 * @component
 * @example
 * ```tsx
 * <MockDataWarning />
 * ```
 * 
 * @description
 * Displays a prominent warning in the footer when mock data is being used
 * instead of real market data from the Alpaca API.
 * 
 * @accessibility
 * - Uses contrasting colors for visibility
 * - Includes aria-live to announce the warning to screen readers
 */
export function MockDataWarning() {
  const [isMockingData, setIsMockingData] = useState<boolean>(false)
  const [mounted, setMounted] = useState<boolean>(false)
  
  // First useEffect to handle component mounting
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Second useEffect to check for credentials after mounting
  useEffect(() => {
    if (mounted) {
      const hasCredentials = localStorage.getItem('alpaca_api_key') && 
                             localStorage.getItem('alpaca_secret_key')
      setIsMockingData(!hasCredentials)
    }
  }, [mounted])
  
  // Don't render anything on the server or before client-side hydration is complete
  if (!mounted) {
    return null
  }
  
  if (!isMockingData) {
    return null
  }
  
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-yellow-500 text-black shadow-lg"
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center justify-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 mr-2" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
        <div>
          <p className="font-bold">MOCK DATA IN USE</p>
          <p className="text-sm">Go to settings to configure API access</p>
        </div>
      </div>
    </div>
  )
}
