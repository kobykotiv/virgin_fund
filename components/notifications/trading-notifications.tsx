"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info' | 'price'
  title: string
  message: string
  timestamp: Date
  action?: {
    label: string
    onClick: () => void
  }
  symbol?: string
  price?: number
  change?: number
}

export function TradingNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isVisible, setIsVisible] = useState(true)

  // Simulate real-time notifications
  useEffect(() => {
    const createNotification = () => {
      const types: Notification['type'][] = ['success', 'warning', 'error', 'info', 'price']
      const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA', 'AMZN', 'META', 'NFLX']
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)]
      const randomType = types[Math.floor(Math.random() * types.length)]

      let notification: Notification

      switch (randomType) {
        case 'price':
          const change = (Math.random() - 0.5) * 10
          const price = 100 + Math.random() * 200
          notification = {
            id: Date.now().toString(),
            type: 'price',
            title: "Price Alert",
            message: `${randomSymbol} ${change >= 0 ? 'up' : 'down'} ${Math.abs(change).toFixed(2)}%`,
            timestamp: new Date(),
            symbol: randomSymbol,
            price: price,
            change: change,
            action: {
              label: "View Chart",
              onClick: () => console.log(`View ${randomSymbol} chart`)
            }
          }
          break
        case 'success':
          notification = {
            id: Date.now().toString(),
            type: 'success',
            title: "Order Executed",
            message: `Buy order for ${randomSymbol} filled successfully`,
            timestamp: new Date(),
            action: {
              label: "View Order",
              onClick: () => console.log("View order details")
            }
          }
          break
        case 'warning':
          notification = {
            id: Date.now().toString(),
            type: 'warning',
            title: "Market Alert",
            message: `High volatility detected in ${randomSymbol}`,
            timestamp: new Date(),
            action: {
              label: "Review Position",
              onClick: () => console.log("Review position")
            }
          }
          break
        case 'error':
          notification = {
            id: Date.now().toString(),
            type: 'error',
            title: "Order Failed",
            message: `Insufficient funds for ${randomSymbol} order`,
            timestamp: new Date(),
            action: {
              label: "Add Funds",
              onClick: () => console.log("Add funds")
            }
          }
          break
        default:
          notification = {
            id: Date.now().toString(),
            type: 'info',
            title: "Market News",
            message: `Breaking: ${randomSymbol} announces quarterly results`,
            timestamp: new Date(),
            action: {
              label: "Read More",
              onClick: () => console.log("Read news")
            }
          }
      }

      setNotifications(prev => [notification, ...prev.slice(0, 4)]) // Keep max 5
    }

    // Create initial notification
    createNotification()

    // Set up interval for periodic notifications
    const interval = setInterval(createNotification, 45000) // Every 45 seconds

    return () => clearInterval(interval)
  }, [])

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'error': return <AlertTriangle className="h-5 w-5 text-red-500" />
      case 'info': return <Info className="h-5 w-5 text-blue-500" />
      case 'price': return <TrendingUp className="h-5 w-5 text-purple-500" />
    }
  }

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'border-green-200 bg-green-50 dark:bg-green-950/20'
      case 'warning': return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20'
      case 'error': return 'border-red-200 bg-red-50 dark:bg-red-950/20'
      case 'info': return 'border-blue-200 bg-blue-50 dark:bg-blue-950/20'
      case 'price': return 'border-purple-200 bg-purple-50 dark:bg-purple-950/20'
    }
  }

  if (!isVisible || notifications.length === 0) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.3 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.3 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              duration: 0.4
            }}
            className={cn(
              "bg-card border rounded-lg shadow-lg p-4 min-w-80",
              getTypeColor(notification.type)
            )}
          >
            <div className="flex items-start space-x-3">
              {getIcon(notification.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm truncate">{notification.title}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeNotification(notification.id)}
                    className="h-6 w-6 p-0 hover:bg-accent/50 ml-2 flex-shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {notification.message}
                </p>

                {notification.symbol && (
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {notification.symbol}
                    </Badge>
                    {notification.price && (
                      <span className="text-xs text-muted-foreground">
                        ${notification.price.toFixed(2)}
                      </span>
                    )}
                    {notification.change && (
                      <span className={cn(
                        "text-xs font-medium",
                        notification.change >= 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {notification.change >= 0 ? "+" : ""}{notification.change.toFixed(2)}%
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-muted-foreground">
                    {notification.timestamp.toLocaleTimeString()}
                  </span>
                  {notification.action && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={notification.action.onClick}
                      className="h-7 text-xs px-3"
                    >
                      {notification.action.label}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Notification Toggle */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="h-8 px-3 text-xs"
        >
          <Bell className="h-3 w-3 mr-1" />
          Hide Notifications
        </Button>
      </div>
    </div>
  )
}
