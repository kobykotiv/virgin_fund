import { Bot, Position, Trade } from "@/types/bot"

type WebSocketMessage = {
  type: 'bot_update' | 'position_update' | 'trade_update' | 'error'
  data: any
}

export class BotWebSocket {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private listeners: Map<string, Function[]> = new Map()

  constructor(private url: string) {
    this.connect()
  }

  private connect() {
    try {
      this.ws = new WebSocket(this.url)
      this.ws.onmessage = this.handleMessage.bind(this)
      this.ws.onclose = this.handleClose.bind(this)
      this.ws.onerror = this.handleError.bind(this)
    } catch (error) {
      console.error('WebSocket connection error:', error)
    }
  }

  private handleMessage(event: MessageEvent) {
    try {
      const message: WebSocketMessage = JSON.parse(event.data)
      const listeners = this.listeners.get(message.type) || []
      listeners.forEach(listener => listener(message.data))
    } catch (error) {
      console.error('Error parsing WebSocket message:', error)
    }
  }

  private handleClose() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++
        this.connect()
      }, this.reconnectDelay * this.reconnectAttempts)
    }
  }

  private handleError(error: Event) {
    console.error('WebSocket error:', error)
  }

  subscribe(type: WebSocketMessage['type'], callback: Function) {
    const listeners = this.listeners.get(type) || []
    this.listeners.set(type, [...listeners, callback])
  }

  unsubscribe(type: WebSocketMessage['type'], callback: Function) {
    const listeners = this.listeners.get(type) || []
    this.listeners.set(type, listeners.filter(listener => listener !== callback))
  }

  send(message: WebSocketMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    }
  }

  close() {
    if (this.ws) {
      this.ws.close()
    }
  }
}
