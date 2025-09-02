import React, { createContext, useContext, useState, ReactNode } from 'react'

interface Toast {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'destructive' | 'success'
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  toast: (toast: Omit<Toast, 'id'>) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = (newToast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const toastWithId = { ...newToast, id }

    setToasts(prev => [...prev, toastWithId])

    // Auto dismiss after duration
    const duration = newToast.duration || 5000
    setTimeout(() => {
      dismiss(id)
    }, duration)
  }

  const dismiss = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const value: ToastContextType = {
    toasts,
    toast,
    dismiss,
  }

  return React.createElement(
    ToastContext.Provider,
    { value },
    children
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
