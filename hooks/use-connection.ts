import { useState, useEffect } from 'react'
import { ConnectionManager } from '@/lib/connection-manager'

export function useConnection(wsUrl: string) {
  const [status, setStatus] = useState(ConnectionManager.getInstance(wsUrl).getStatus())

  useEffect(() => {
    const manager = ConnectionManager.getInstance(wsUrl)
    
    const handleStatusChange = (newStatus: string) => {
      setStatus(newStatus)
    }

    manager.addListener(handleStatusChange)
    
    if (status === 'disconnected') {
      manager.connect()
    }

    return () => {
      manager.removeListener(handleStatusChange)
    }
  }, [wsUrl])

  return {
    status,
    isConnected: status === 'connected',
    isConnecting: status === 'connecting',
    hasError: status === 'error'
  }
}
