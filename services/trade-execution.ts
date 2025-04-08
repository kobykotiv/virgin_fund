import { Trade, Position } from "@/types/bot";
import WebSocket from "ws";

export interface ExecutionRequest {
  botId: string;
  symbol: string;
  side: "buy" | "sell";
  type: "market" | "limit";
  quantity: number;
  price?: number;
  positionId?: string;
}

export class TradeExecutionService {
  private ws: WebSocket | null = null;
  private pendingExecutions = new Map<string, (result: Trade) => void>();
  
  constructor(private wsUrl: string) {
    this.connect();
  }

  private connect() {
    this.ws = new WebSocket(this.wsUrl);
    
    this.ws.on("message", (data: string) => {
      const result = JSON.parse(data);
      if (result.type === "execution") {
        const callback = this.pendingExecutions.get(result.requestId);
        if (callback) {
          callback(result.trade);
          this.pendingExecutions.delete(result.requestId);
        }
      }
    });

    this.ws.on("close", () => {
      setTimeout(() => this.connect(), 5000);
    });
  }

  async executeTrade(request: ExecutionRequest): Promise<Trade> {
    return new Promise((resolve, reject) => {
      const requestId = Math.random().toString(36).substring(7);
      
      this.pendingExecutions.set(requestId, resolve);
      
      this.ws?.send(JSON.stringify({
        type: "execute",
        requestId,
        ...request
      }));

      // Timeout after 10 seconds
      setTimeout(() => {
        this.pendingExecutions.delete(requestId);
        reject(new Error("Trade execution timeout"));
      }, 10000);
    });
  }
}
