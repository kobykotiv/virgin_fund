import { Trade, Position } from "@/types/bot"

export class TradeExecutor {
  private ws: WebSocket | null = null
  private pendingTrades = new Map<string, (result: Trade) => void>()

  constructor(private wsUrl: string) {
    this.connect()
  }

  private connect() {
    this.ws = new WebSocket(this.wsUrl)
    
    this.ws.onmessage = (event) => {
      const response = JSON.parse(event.data)
      if (response.type === "trade_executed") {
        const callback = this.pendingTrades.get(response.requestId)
        if (callback) {
          callback(response.trade)
          this.pendingTrades.delete(response.requestId)
        }
      }
    }

    this.ws.onclose = () => {
      setTimeout(() => this.connect(), 5000)
    }
  }

  async executeTrade(trade: Partial<Trade>): Promise<Trade> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket not connected")
    }

    return new Promise((resolve, reject) => {
      const requestId = Math.random().toString(36).substring(7)
      
      this.pendingTrades.set(requestId, resolve)
      
      this.ws!.send(JSON.stringify({
        type: "execute_trade",
        requestId,
        trade
      }))

      // Timeout after 10 seconds
      setTimeout(() => {
        this.pendingTrades.delete(requestId)
        reject(new Error("Trade execution timeout"))
      }, 10000)
    })
  }

  async closePosition(position: Position): Promise<Trade> {
    return this.executeTrade({
      symbol: position.symbol,
      side: "sell",
      quantity: position.quantity,
      type: "market",
      timestamp: new Date().toISOString()
    })
  }
}
