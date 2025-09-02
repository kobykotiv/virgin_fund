import { WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import { JWTPayload } from './auth.js';

interface WebSocketClient {
  ws: WebSocket;
  userId: string;
  tenantId: string;
  subscriptions: Set<string>;
}

/**
 * WebSocket manager for real-time portfolio and market data updates
 */
export class WSManager {
  private clients = new Map<string, WebSocketClient>();
  private portfolioUpdateInterval?: Timer;
  private quoteUpdateInterval?: Timer;

  constructor() {
    this.startBackgroundUpdates();
  }

  /**
   * Handle new WebSocket connection with authentication
   */
  handleConnection(ws: WebSocket, request: Request) {
    try {
      const url = new URL(request.url!);
      const token = url.searchParams.get('token') || 
                   request.headers.get('authorization')?.replace('Bearer ', '');
      
      if (!token) {
        ws.close(1008, 'Authentication required');
        return;
      }

      const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
      const clientId = `${payload.tenantId}-${payload.userId}-${Date.now()}`;
      
      const client: WebSocketClient = {
        ws,
        userId: payload.userId,
        tenantId: payload.tenantId,
        subscriptions: new Set(),
      };

      this.clients.set(clientId, client);
      console.log(`WebSocket client connected: ${clientId}`);

      // Setup message handlers
      ws.on('message', (data) => this.handleMessage(clientId, data));
      ws.on('close', () => this.handleDisconnect(clientId));
      ws.on('error', (error) => {
        console.error(`WebSocket error for ${clientId}:`, error);
        this.handleDisconnect(clientId);
      });

      // Send welcome message
      this.sendToClient(clientId, {
        type: 'connected',
        data: { clientId, timestamp: new Date().toISOString() }
      });

    } catch (error) {
      console.error('WebSocket authentication failed:', error);
      ws.close(1008, 'Invalid token');
    }
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(clientId: string, data: any) {
    try {
      const message = JSON.parse(data.toString());
      const client = this.clients.get(clientId);
      
      if (!client) return;

      switch (message.type) {
        case 'subscribe_portfolio':
          client.subscriptions.add('portfolio');
          this.sendPortfolioUpdate(clientId);
          break;
          
        case 'subscribe_quotes':
          const symbols = message.symbols || [];
          symbols.forEach((symbol: string) => {
            client.subscriptions.add(`quote:${symbol}`);
          });
          break;
          
        case 'unsubscribe':
          const subscription = message.subscription;
          if (subscription) {
            client.subscriptions.delete(subscription);
          } else {
            client.subscriptions.clear();
          }
          break;
          
        case 'ping':
          this.sendToClient(clientId, { type: 'pong', timestamp: new Date().toISOString() });
          break;
          
        default:
          console.warn(`Unknown message type: ${message.type}`);
      }
    } catch (error) {
      console.error(`Error handling message from ${clientId}:`, error);
    }
  }

  /**
   * Handle client disconnection
   */
  private handleDisconnect(clientId: string) {
    this.clients.delete(clientId);
    console.log(`WebSocket client disconnected: ${clientId}`);
  }

  /**
   * Send message to specific client
   */
  private sendToClient(clientId: string, message: any) {
    const client = this.clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      try {
        client.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error(`Error sending to client ${clientId}:`, error);
        this.handleDisconnect(clientId);
      }
    }
  }

  /**
   * Broadcast message to all clients with specific subscription
   */
  private broadcast(subscription: string, message: any) {
    for (const [clientId, client] of this.clients) {
      if (client.subscriptions.has(subscription)) {
        this.sendToClient(clientId, message);
      }
    }
  }

  /**
   * Send portfolio update to specific client
   */
  private sendPortfolioUpdate(clientId: string) {
    const mockPortfolio = this.generateMockPortfolioData();
    this.sendToClient(clientId, {
      type: 'portfolio_update',
      data: mockPortfolio,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Broadcast analysis progress to tenant clients
   */
  broadcastAnalysisProgress(tenantId: string, jobId: string, progress: any) {
    for (const [clientId, client] of this.clients) {
      if (client.tenantId === tenantId) {
        this.sendToClient(clientId, {
          type: 'analysis_progress',
          data: { jobId, ...progress },
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  /**
   * Start background processes for simulated updates
   */
  private startBackgroundUpdates() {
    // Portfolio updates every 5 seconds
    this.portfolioUpdateInterval = setInterval(() => {
      const mockPortfolio = this.generateMockPortfolioData();
      this.broadcast('portfolio', {
        type: 'portfolio_update',
        data: mockPortfolio,
        timestamp: new Date().toISOString()
      });
    }, 5000);

    // Quote updates every 2 seconds
    this.quoteUpdateInterval = setInterval(() => {
      const quotes = this.generateMockQuoteData();
      for (const quote of quotes) {
        this.broadcast(`quote:${quote.symbol}`, {
          type: 'quote_update',
          data: quote,
          timestamp: new Date().toISOString()
        });
      }
    }, 2000);
  }

  /**
   * Generate mock portfolio data for simulation
   */
  private generateMockPortfolioData() {
    return {
      totalValue: 100000 + (Math.random() - 0.5) * 1000,
      dayChange: (Math.random() - 0.5) * 2000,
      dayChangePercent: (Math.random() - 0.5) * 4,
      positions: [
        {
          symbol: 'AAPL',
          shares: 50,
          avgPrice: 150.00,
          currentPrice: 150.00 + (Math.random() - 0.5) * 10,
          marketValue: 0,
          unrealizedPnL: 0,
        },
        {
          symbol: 'GOOGL',
          shares: 10,
          avgPrice: 2500.00,
          currentPrice: 2500.00 + (Math.random() - 0.5) * 100,
          marketValue: 0,
          unrealizedPnL: 0,
        },
        {
          symbol: 'MSFT',
          shares: 25,
          avgPrice: 300.00,
          currentPrice: 300.00 + (Math.random() - 0.5) * 20,
          marketValue: 0,
          unrealizedPnL: 0,
        }
      ].map(pos => {
        pos.marketValue = pos.shares * pos.currentPrice;
        pos.unrealizedPnL = pos.shares * (pos.currentPrice - pos.avgPrice);
        return pos;
      })
    };
  }

  /**
   * Generate mock quote data for simulation
   */
  private generateMockQuoteData() {
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'];
    return symbols.map(symbol => ({
      symbol,
      price: 100 + Math.random() * 200,
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 5,
      volume: Math.floor(Math.random() * 1000000),
      timestamp: new Date().toISOString()
    }));
  }

  /**
   * Clean up resources
   */
  destroy() {
    if (this.portfolioUpdateInterval) {
      clearInterval(this.portfolioUpdateInterval);
    }
    if (this.quoteUpdateInterval) {
      clearInterval(this.quoteUpdateInterval);
    }
    
    // Close all connections
    for (const [clientId, client] of this.clients) {
      client.ws.close();
    }
    this.clients.clear();
  }
}