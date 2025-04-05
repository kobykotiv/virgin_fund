import { isDemoMode, DEMO_ORDERS_KEY } from "./demo-service"
import { executeOrder as executeRealOrder } from "@/lib/bot-api"

export interface Order {
  id: string
  symbol: string
  side: "buy" | "sell"
  type: "market" | "limit"
  quantity: number
  price?: number
  status: "open" | "filled" | "canceled"
  createdAt: string
  filledAt?: string
  filledPrice?: number
  filledQuantity?: number
  botId?: string
}

export interface OrderRequest {
  symbol: string
  side: "buy" | "sell"
  type: "market" | "limit"
  quantity: number
  price?: number
}

// Fetch orders
export async function fetchOrders(): Promise<Order[]> {
  if (isDemoMode()) {
    return fetchDemoOrders()
  } else {
    // In a real app, this would call the API
    return fetchRealOrders()
  }
}

// Execute an order
export async function executeOrder(orderRequest: OrderRequest): Promise<Order> {
  if (isDemoMode()) {
    return executeDemoOrder(orderRequest)
  } else {
    return executeRealOrder(orderRequest)
  }
}

// Cancel an order
export async function cancelOrder(orderId: string): Promise<Order> {
  if (isDemoMode()) {
    return cancelDemoOrder(orderId)
  } else {
    // In a real app, this would call the API
    return cancelRealOrder(orderId)
  }
}

// Demo mode implementations
function fetchDemoOrders(): Promise<Order[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orders = JSON.parse(localStorage.getItem(DEMO_ORDERS_KEY) || "[]")
      resolve(orders)
    }, 500)
  })
}

function executeDemoOrder(orderRequest: OrderRequest): Promise<Order> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orders = JSON.parse(localStorage.getItem(DEMO_ORDERS_KEY) || "[]")
      const now = new Date().toISOString()

      // For demo purposes, market orders are filled immediately, limit orders stay open
      const isMarket = orderRequest.type === "market"

      const newOrder: Order = {
        id: `ord_demo_${Date.now()}`,
        symbol: orderRequest.symbol,
        side: orderRequest.side,
        type: orderRequest.type,
        quantity: orderRequest.quantity,
        price: orderRequest.price,
        status: isMarket ? "filled" : "open",
        createdAt: now,
        ...(isMarket && {
          filledAt: now,
          filledPrice: orderRequest.price || getRandomPrice(orderRequest.symbol),
          filledQuantity: orderRequest.quantity,
        }),
      }

      orders.push(newOrder)
      localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify(orders))

      resolve(newOrder)
    }, 500)
  })
}

function cancelDemoOrder(orderId: string): Promise<Order> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const orders = JSON.parse(localStorage.getItem(DEMO_ORDERS_KEY) || "[]")
      const index = orders.findIndex((o: Order) => o.id === orderId)

      if (index === -1) {
        reject(new Error(`Order with ID ${orderId} not found`))
        return
      }

      if (orders[index].status === "filled") {
        reject(new Error("Cannot cancel a filled order"))
        return
      }

      const updatedOrder = {
        ...orders[index],
        status: "canceled",
      }

      orders[index] = updatedOrder
      localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify(orders))

      resolve(updatedOrder)
    }, 500)
  })
}

// Real API implementations (placeholders)
function fetchRealOrders(): Promise<Order[]> {
  return new Promise((resolve) => {
    // In a real app, this would call the API
    setTimeout(() => {
      resolve([])
    }, 500)
  })
}

function cancelRealOrder(orderId: string): Promise<Order> {
  return new Promise((resolve) => {
    // In a real app, this would call the API
    setTimeout(() => {
      resolve({} as Order)
    }, 500)
  })
}

// Helper function to get a random price for a symbol
function getRandomPrice(symbol: string): number {
  // Return realistic prices for common stocks
  switch (symbol) {
    case "AAPL":
      return 180 + (Math.random() * 10 - 5)
    case "MSFT":
      return 350 + (Math.random() * 15 - 7.5)
    case "GOOGL":
      return 130 + (Math.random() * 8 - 4)
    case "AMZN":
      return 140 + (Math.random() * 10 - 5)
    case "TSLA":
      return 240 + (Math.random() * 20 - 10)
    case "BTC-USD":
      return 28000 + (Math.random() * 1000 - 500)
    case "ETH-USD":
      return 1800 + (Math.random() * 100 - 50)
    case "SPY":
      return 450 + (Math.random() * 5 - 2.5)
    case "QQQ":
      return 380 + (Math.random() * 8 - 4)
    case "VTI":
      return 220 + (Math.random() * 4 - 2)
    default:
      return 100 + (Math.random() * 10 - 5)
  }
}

