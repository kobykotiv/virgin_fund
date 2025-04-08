"use client"

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import components with SSR disabled
const ErrorRecoveryBoundary = dynamic(
  () => import('@/components/error-recovery-boundary').then(mod => mod.ErrorRecoveryBoundary),
  { ssr: false }
)

const ConnectionStatus = dynamic(
  () => import('@/components/common/connection-status').then(mod => mod.ConnectionStatus),
  { ssr: false }
)

const NetworkStatusIndicator = dynamic(
  () => import('@/components/network/status-indicator').then(mod => mod.NetworkStatusIndicator),
  { ssr: false }
)

interface ClientProvidersProps {
  children: React.ReactNode
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ErrorRecoveryBoundary
      recoveryStrategies={[
        // Clear local storage cache
        async () => {
          try {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('offline_cache')
            }
            return true
          } catch (e) {
            return false
          }
        },
        // Attempt to reconnect to services
        async () => {
          try {
            // In a client component we can safely import this,
            // but it's better to handle via an API call
            // const db = DatabaseService.getInstance()
            // return await db.reconnect()
            return true
          } catch (e) {
            return false
          }
        }
      ]}
    >
      <ConnectionStatus />
      <div className="fixed bottom-4 right-4 z-50">
        <NetworkStatusIndicator />
      </div>
      {children}
    </ErrorRecoveryBoundary>
  )
}
