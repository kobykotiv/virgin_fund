import { httpClient } from './httpClient';
import { 
  Portfolio, 
  HeatmapData, 
  Trade, 
  TradeRequest, 
  AnalysisRequest, 
  AnalysisResult,
  Indicators, 
  NewsItem, 
  ScheduledJob, 
  CreateJob,
  PnLReport, 
  MetricsReport, 
  User, 
  ProfileUpdate,
  Integration, 
  ConnectIntegration,
  PortfolioSchema,
  HeatmapDataSchema,
  TradeSchema,
  IndicatorsSchema,
  PnLReportSchema,
  MetricsReportSchema,
  UserSchema,
  ScheduledJobSchema,
} from '../schemas/schemas';

/**
 * Typed API clients for all Trading Agent endpoints
 * Each client provides type-safe methods for interacting with the backend
 */

/**
 * Portfolio API Client
 */
export const portfolioClient = {
  /**
   * Get current portfolio status
   */
  async getPortfolio(): Promise<Portfolio> {
    const data = await httpClient.get('/api/portfolio');
    return PortfolioSchema.parse(data);
  },

  /**
   * Get portfolio heatmap data
   */
  async getHeatmap(): Promise<HeatmapData> {
    const data = await httpClient.get('/api/heatmap');
    return HeatmapDataSchema.parse(data);
  },
};

/**
 * Trading API Client
 */
export const tradingClient = {
  /**
   * Execute a trade
   */
  async executeTrade(trade: TradeRequest): Promise<Trade> {
    const data = await httpClient.post('/api/trades/execute', trade);
    return TradeSchema.parse(data);
  },

  /**
   * Get open positions/orders
   */
  async getOpenTrades(): Promise<Trade[]> {
    const data = await httpClient.get('/api/trades/open');
    return data.map((trade: any) => TradeSchema.parse(trade));
  },

  /**
   * Get trading history
   */
  async getTradeHistory(limit = 50, offset = 0): Promise<{ 
    trades: Trade[]; 
    total: number; 
    limit: number; 
    offset: number; 
  }> {
    const data = await httpClient.get(`/api/trades/history?limit=${limit}&offset=${offset}`);
    
    return {
      ...data,
      trades: data.trades.map((trade: any) => TradeSchema.parse(trade)),
    };
  },
};

/**
 * Analysis API Client
 */
export const analysisClient = {
  /**
   * Get agent status
   */
  async getAgentStatus(): Promise<{
    cliAvailable: boolean;
    activeJobs: number;
    totalJobs: number;
    jobs: any[];
  }> {
    return httpClient.get('/api/agents/status');
  },

  /**
   * Start analysis job
   */
  async startAnalysis(request: AnalysisRequest): Promise<{
    success: boolean;
    message: string;
    jobId?: string;
  }> {
    return httpClient.post('/api/agents/analyze', request);
  },

  /**
   * Get technical indicators for a symbol
   */
  async getIndicators(symbol: string, timeframe = '1d'): Promise<Indicators> {
    const data = await httpClient.get(`/api/indicators/${symbol}?timeframe=${timeframe}`);
    return IndicatorsSchema.parse(data);
  },

  /**
   * Get news for a symbol
   */
  async getNews(symbol: string): Promise<NewsItem[]> {
    const data = await httpClient.get(`/api/news/${symbol}`);
    return data; // NewsItem validation would be applied here
  },
};

/**
 * Scheduler API Client
 */
export const schedulerClient = {
  /**
   * Get all scheduled jobs
   */
  async getJobs(): Promise<ScheduledJob[]> {
    const data = await httpClient.get('/api/scheduler/jobs');
    return data.map((job: any) => ScheduledJobSchema.parse(job));
  },

  /**
   * Create a new scheduled job
   */
  async createJob(job: CreateJob): Promise<ScheduledJob> {
    const data = await httpClient.post('/api/scheduler/jobs', job);
    return ScheduledJobSchema.parse(data);
  },

  /**
   * Delete a scheduled job
   */
  async deleteJob(jobId: string): Promise<{ success: boolean }> {
    return httpClient.delete(`/api/scheduler/jobs/${jobId}`);
  },
};

/**
 * Reports API Client
 */
export const reportsClient = {
  /**
   * Get P&L report
   */
  async getPnLReport(period = '30d'): Promise<PnLReport> {
    const data = await httpClient.get(`/api/reports/pnl?period=${period}`);
    return PnLReportSchema.parse(data);
  },

  /**
   * Get performance metrics
   */
  async getMetrics(): Promise<MetricsReport> {
    const data = await httpClient.get('/api/reports/metrics');
    return MetricsReportSchema.parse(data);
  },

  /**
   * Export data
   */
  async exportData(format = 'csv'): Promise<{
    exportUrl: string;
    expiresAt: string;
  }> {
    return httpClient.get(`/api/reports/export?format=${format}`);
  },
};

/**
 * Settings API Client
 */
export const settingsClient = {
  /**
   * Get user profile
   */
  async getProfile(): Promise<User> {
    const data = await httpClient.get('/api/settings/profile');
    return UserSchema.parse(data);
  },

  /**
   * Update user profile
   */
  async updateProfile(updates: ProfileUpdate): Promise<User> {
    const data = await httpClient.post('/api/settings/profile', updates);
    return UserSchema.parse(data);
  },

  /**
   * Get integrations
   */
  async getIntegrations(): Promise<Integration[]> {
    return httpClient.get('/api/integrations');
  },

  /**
   * Connect new integration
   */
  async connectIntegration(integration: ConnectIntegration): Promise<Integration> {
    return httpClient.post('/api/integrations/connect', integration);
  },

  /**
   * Disconnect integration
   */
  async disconnectIntegration(integrationId: string): Promise<{ success: boolean }> {
    return httpClient.delete(`/api/integrations/${integrationId}`);
  },
};

/**
 * WebSocket Client for real-time updates
 */
export class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageHandlers = new Map<string, Function[]>();

  constructor(
    private url: string = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001',
    private token?: string
  ) {}

  /**
   * Connect to WebSocket server
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = this.token ? `${this.url}?token=${this.token}` : this.url;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.attemptReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Send message to server
   */
  send(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected');
    }
  }

  /**
   * Subscribe to message type
   */
  on(messageType: string, handler: Function) {
    if (!this.messageHandlers.has(messageType)) {
      this.messageHandlers.set(messageType, []);
    }
    this.messageHandlers.get(messageType)!.push(handler);
  }

  /**
   * Unsubscribe from message type
   */
  off(messageType: string, handler: Function) {
    const handlers = this.messageHandlers.get(messageType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Subscribe to portfolio updates
   */
  subscribePortfolio() {
    this.send({ type: 'subscribe_portfolio' });
  }

  /**
   * Subscribe to quote updates
   */
  subscribeQuotes(symbols: string[]) {
    this.send({ type: 'subscribe_quotes', symbols });
  }

  /**
   * Unsubscribe from updates
   */
  unsubscribe(subscription?: string) {
    this.send({ type: 'unsubscribe', subscription });
  }

  /**
   * Handle incoming messages
   */
  private handleMessage(message: any) {
    const handlers = this.messageHandlers.get(message.type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(message.data, message);
        } catch (error) {
          console.error('Error in message handler:', error);
        }
      });
    }
  }

  /**
   * Attempt to reconnect
   */
  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`Attempting to reconnect in ${delay}ms (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect().catch(error => {
          console.error('Reconnection failed:', error);
        });
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }
}

// Export a default WebSocket client instance
export const wsClient = new WebSocketClient();

// Export all API clients as a combined object
export const apiClients = {
  portfolio: portfolioClient,
  trading: tradingClient,
  analysis: analysisClient,
  scheduler: schedulerClient,
  reports: reportsClient,
  settings: settingsClient,
  ws: wsClient,
};