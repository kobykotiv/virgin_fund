import { z } from 'zod';
import { authMiddleware, createCORSHeaders } from '../utils/auth.js';
import { CLIProxy } from '../agents/cliProxy.js';

// Initialize CLI proxy
const cliProxy = new CLIProxy(process.env.TRADING_AGENTS_CLI_PATH);

/**
 * Comprehensive REST API routes for the Trading Agent dashboard
 * All routes require authentication via authMiddleware
 */
export function createAPIRoutes(wsManager: any) {
  // Inject WebSocket manager into CLI proxy
  cliProxy.setWSManager(wsManager);

  return {
    // Portfolio endpoints
    '/api/portfolio': {
      GET: async (req: Request) => {
        const auth = authMiddleware(req);
        if (auth instanceof Response) return auth;

        // Mock portfolio data - replace with real data source
        const portfolio = {
          totalValue: 125650.00,
          dayChange: 2340.50,
          dayChangePercent: 1.9,
          cashBalance: 15000.00,
          positions: [
            {
              symbol: 'AAPL',
              shares: 50,
              avgPrice: 150.00,
              currentPrice: 155.25,
              marketValue: 7762.50,
              unrealizedPnL: 262.50,
              unrealizedPnLPercent: 3.5,
              dayChange: 125.00,
              weight: 6.2
            },
            {
              symbol: 'GOOGL',
              shares: 10,
              avgPrice: 2500.00,
              currentPrice: 2580.75,
              marketValue: 25807.50,
              unrealizedPnL: 807.50,
              unrealizedPnLPercent: 3.2,
              dayChange: 450.00,
              weight: 20.5
            },
            {
              symbol: 'MSFT',
              shares: 25,
              avgPrice: 300.00,
              currentPrice: 315.60,
              marketValue: 7890.00,
              unrealizedPnL: 390.00,
              unrealizedPnLPercent: 5.2,
              dayChange: 195.00,
              weight: 6.3
            }
          ],
          performance: {
            totalReturn: 15650.00,
            totalReturnPercent: 14.2,
            yearToDate: 8750.00,
            yearToDatePercent: 7.9
          }
        };

        return new Response(JSON.stringify(portfolio), {
          headers: { 'Content-Type': 'application/json', ...createCORSHeaders(req) }
        });
      }
    },

    '/api/heatmap': {
      GET: async (req: Request) => {
        const auth = authMiddleware(req);
        if (auth instanceof Response) return auth;

        // Mock heatmap data
        const heatmapData = {
          sectors: [
            { name: 'Technology', value: 45000, change: 2.1, color: '#10b981' },
            { name: 'Healthcare', value: 25000, change: -0.8, color: '#ef4444' },
            { name: 'Finance', value: 35000, change: 1.5, color: '#10b981' },
            { name: 'Consumer', value: 20000, change: 0.3, color: '#22c55e' }
          ],
          assets: [
            { symbol: 'AAPL', name: 'Apple Inc.', value: 7762.50, change: 1.6, size: 'large' },
            { symbol: 'GOOGL', name: 'Alphabet Inc.', value: 25807.50, change: 1.8, size: 'large' },
            { symbol: 'MSFT', name: 'Microsoft Corp.', value: 7890.00, change: 2.6, size: 'medium' },
            { symbol: 'TSLA', name: 'Tesla Inc.', value: 15000.00, change: -2.1, size: 'medium' }
          ]
        };

        return new Response(JSON.stringify(heatmapData), {
          headers: { 'Content-Type': 'application/json', ...createCORSHeaders(req) }
        });
      }
    },

    // Agent endpoints
    '/api/agents/status': {
      GET: async (req: Request) => {
        const auth = authMiddleware(req);
        if (auth instanceof Response) return auth;

        const isCliAvailable = await cliProxy.isCliAvailable();
        const runningJobs = cliProxy.getAllJobs();

        return new Response(JSON.stringify({
          cliAvailable: isCliAvailable,
          activeJobs: runningJobs.filter(job => job.status === 'running').length,
          totalJobs: runningJobs.length,
          jobs: runningJobs
        }), {
          headers: { 'Content-Type': 'application/json', ...createCORSHeaders(req) }
        });
      }
    },

    '/api/agents/analyze': {
      POST: async (req: Request) => {
        const auth = authMiddleware(req);
        if (auth instanceof Response) return auth;

        try {
          const body = await req.json();
          const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          const analysisJob = {
            jobId,
            symbol: body.symbol,
            strategy: body.strategy || 'momentum',
            parameters: body.parameters,
            timeframe: body.timeframe || '1h',
            lookback: body.lookback || 100
          };

          const result = await cliProxy.startAnalysis(analysisJob, auth.tenantId);

          return new Response(JSON.stringify({
            ...result,
            jobId: result.success ? jobId : undefined
          }), {
            status: result.success ? 200 : 400,
            headers: { 'Content-Type': 'application/json', ...createCORSHeaders(req) }
          });
        } catch (error) {
          return new Response(JSON.stringify({ 
            success: false, 
            message: error instanceof Error ? error.message : 'Invalid request' 
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...createCORSHeaders(req) }
          });
        }
      }
    },

    // Trading endpoints
    '/api/trades/execute': {
      POST: async (req: Request) => {
        const auth = authMiddleware(req);
        if (auth instanceof Response) return auth;

        try {
          const body = await req.json();
          
          // Mock trade execution
          const trade = {
            tradeId: `trade_${Date.now()}`,
            symbol: body.symbol,
            side: body.side, // 'buy' or 'sell'
            quantity: body.quantity,
            orderType: body.orderType || 'market',
            price: body.price,
            timestamp: new Date().toISOString(),
            status: 'executed',
            executedPrice: body.orderType === 'market' ? 
              (body.price || 100) + (Math.random() - 0.5) * 2 : body.price
          };

          return new Response(JSON.stringify(trade), {
            headers: { 'Content-Type': 'application/json', ...createCORSHeaders(req) }
          });
        } catch (error) {
          return new Response(JSON.stringify({ 
            error: 'Invalid trade request' 
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...createCORSHeaders(req) }
          });
        }
      }
    },

    '/api/trades/open': {
      GET: async (req: Request) => {
        const auth = authMiddleware(req);
        if (auth instanceof Response) return auth;

        const openTrades = [
          {
            tradeId: 'trade_123',
            symbol: 'AAPL',
            side: 'buy',
            quantity: 10,
            orderType: 'limit',
            limitPrice: 148.50,
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            status: 'pending'
          }
        ];

        return new Response(JSON.stringify(openTrades), {
          headers: { 'Content-Type': 'application/json', ...createCORSHeaders(req) }
        });
      }
    },

    '/api/trades/history': {
      GET: async (req: Request) => {
        const auth = authMiddleware(req);
        if (auth instanceof Response) return auth;

        const url = new URL(req.url!);
        const limit = parseInt(url.searchParams.get('limit') || '50');
        const offset = parseInt(url.searchParams.get('offset') || '0');

        // Mock trade history
        const history = Array.from({ length: Math.min(limit, 20) }, (_, i) => ({
          tradeId: `trade_${1000 - i}`,
          symbol: ['AAPL', 'GOOGL', 'MSFT', 'TSLA'][i % 4],
          side: i % 2 === 0 ? 'buy' : 'sell',
          quantity: Math.floor(Math.random() * 100) + 1,
          executedPrice: 100 + Math.random() * 200,
          timestamp: new Date(Date.now() - i * 86400000).toISOString(),
          status: 'executed'
        }));

        return new Response(JSON.stringify({
          trades: history,
          total: 1000,
          limit,
          offset
        }), {
          headers: { 'Content-Type': 'application/json', ...createCORSHeaders(req) }
        });
      }
    },

    // Indicators endpoint
    '/api/indicators/:symbol': {
      GET: async (req: Request, params: { symbol: string }) => {
        const auth = authMiddleware(req);
        if (auth instanceof Response) return auth;

        const { symbol } = params;
        const url = new URL(req.url!);
        const timeframe = url.searchParams.get('timeframe') || '1d';

        // Mock technical indicators
        const indicators = {
          symbol,
          timeframe,
          timestamp: new Date().toISOString(),
          data: {
            rsi: Math.random() * 100,
            sma_20: 150 + Math.random() * 50,
            sma_50: 148 + Math.random() * 54,
            ema_12: 152 + Math.random() * 48,
            ema_26: 149 + Math.random() * 52,
            macd: (Math.random() - 0.5) * 10,
            macd_signal: (Math.random() - 0.5) * 8,
            bollinger_upper: 160 + Math.random() * 40,
            bollinger_lower: 140 + Math.random() * 40,
            volume_sma: Math.floor(Math.random() * 1000000),
            atr: Math.random() * 5
          }
        };

        return new Response(JSON.stringify(indicators), {
          headers: { 'Content-Type': 'application/json', ...createCORSHeaders(req) }
        });
      }
    },

    // News endpoint
    '/api/news/:symbol': {
      GET: async (req: Request, params: { symbol: string }) => {
        const auth = authMiddleware(req);
        if (auth instanceof Response) return auth;

        const { symbol } = params;
        
        // Mock news data
        const news = [
          {
            id: '1',
            headline: `${symbol} Reports Strong Q4 Earnings`,
            summary: 'Company exceeds analyst expectations with strong revenue growth.',
            source: 'Financial News',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://example.com/news/1',
            sentiment: 'positive'
          },
          {
            id: '2',
            headline: `Analyst Upgrades ${symbol} to Buy Rating`,
            summary: 'Leading investment firm raises price target citing strong fundamentals.',
            source: 'Market Watch',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            url: 'https://example.com/news/2',
            sentiment: 'positive'
          }
        ];

        return new Response(JSON.stringify(news), {
          headers: { 'Content-Type': 'application/json', ...createCORSHeaders(req) }
        });
      }
    },

    // Scheduler endpoints
    '/api/scheduler/jobs': {
      GET: async (req: Request) => {
        const auth = authMiddleware(req);
        if (auth instanceof Response) return auth;

        const jobs = [
          {
            id: 'job_1',
            name: 'Daily Portfolio Rebalance',
            schedule: '0 9 * * 1-5',
            nextRun: new Date(Date.now() + 86400000).toISOString(),
            enabled: true,
            lastRun: new Date(Date.now() - 86400000).toISOString(),
            status: 'success'
          }
        ];

        return new Response(JSON.stringify(jobs), {
          headers: { 'Content-Type': 'application/json', ...createCORSHeaders(req) }
        });
      },

      POST: async (req: Request) => {
        const auth = authMiddleware(req);
        if (auth instanceof Response) return auth;

        try {
          const body = await req.json();
          const job = {
            id: `job_${Date.now()}`,
            name: body.name,
            schedule: body.schedule,
            enabled: true,
            created: new Date().toISOString(),
            nextRun: new Date(Date.now() + 86400000).toISOString()
          };

          return new Response(JSON.stringify(job), {
            status: 201,
            headers: { 'Content-Type': 'application/json', ...createCORSHeaders(req) }
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: 'Invalid job data' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...createCORSHeaders(req) }
          });
        }
      }
    },

    '/api/scheduler/jobs/:id': {
      DELETE: async (req: Request, params: { id: string }) => {
        const auth = authMiddleware(req);
        if (auth instanceof Response) return auth;

        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json', ...createCORSHeaders(req) }
        });
      }
    },

    // Reports endpoints
    '/api/reports/pnl': {
      GET: async (req: Request) => {
        const auth = authMiddleware(req);
        if (auth instanceof Response) return auth;

        const url = new URL(req.url!);
        const period = url.searchParams.get('period') || '30d';

        const report = {
          period,
          totalPnL: 12500.75,
          realizedPnL: 8200.50,
          unrealizedPnL: 4300.25,
          transactions: 45,
          winRate: 72.5,
          avgWin: 285.60,
          avgLoss: -155.30,
          maxDrawdown: -2100.00,
          sharpeRatio: 1.85
        };

        return new Response(JSON.stringify(report), {
          headers: { 'Content-Type': 'application/json', ...createCORSHeaders(req) }
        });
      }
    },

    '/api/reports/metrics': {
      GET: async (req: Request) => {
        const auth = authMiddleware(req);
        if (auth instanceof Response) return auth;

        const metrics = {
          performance: {
            totalReturn: 14.2,
            annualizedReturn: 18.6,
            volatility: 12.8,
            sharpeRatio: 1.45,
            maxDrawdown: -8.3,
            beta: 0.95
          },
          risk: {
            varDaily: -1850.00,
            varWeekly: -4200.00,
            expectedShortfall: -2300.00,
            correlation: 0.78
          },
          allocation: {
            equity: 85.2,
            bonds: 10.8,
            cash: 4.0,
            alternatives: 0.0
          }
        };

        return new Response(JSON.stringify(metrics), {
          headers: { 'Content-Type': 'application/json', ...createCORSHeaders(req) }
        });
      }
    },

    '/api/reports/export': {
      GET: async (req: Request) => {
        const auth = authMiddleware(req);
        if (auth instanceof Response) return auth;

        const url = new URL(req.url!);
        const format = url.searchParams.get('format') || 'csv';

        // Mock export URL
        const exportUrl = `https://api.example.com/exports/portfolio_${Date.now()}.${format}`;

        return new Response(JSON.stringify({ 
          exportUrl,
          expiresAt: new Date(Date.now() + 3600000).toISOString()
        }), {
          headers: { 'Content-Type': 'application/json', ...createCORSHeaders(req) }
        });
      }
    },

    // Settings endpoints
    '/api/settings/profile': {
      GET: async (req: Request) => {
        const auth = authMiddleware(req);
        if (auth instanceof Response) return auth;

        return new Response(JSON.stringify(auth.user), {
          headers: { 'Content-Type': 'application/json', ...createCORSHeaders(req) }
        });
      },

      POST: async (req: Request) => {
        const auth = authMiddleware(req);
        if (auth instanceof Response) return auth;

        try {
          const body = await req.json();
          const updatedUser = { ...auth.user, ...body };

          return new Response(JSON.stringify(updatedUser), {
            headers: { 'Content-Type': 'application/json', ...createCORSHeaders(req) }
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: 'Invalid profile data' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...createCORSHeaders(req) }
          });
        }
      }
    },

    // Integrations endpoints
    '/api/integrations': {
      GET: async (req: Request) => {
        const auth = authMiddleware(req);
        if (auth instanceof Response) return auth;

        const integrations = [
          {
            id: 'alpaca',
            name: 'Alpaca Trading',
            type: 'broker',
            status: 'connected',
            connectedAt: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: 'yahoo_finance',
            name: 'Yahoo Finance',
            type: 'data',
            status: 'connected',
            connectedAt: new Date(Date.now() - 172800000).toISOString()
          }
        ];

        return new Response(JSON.stringify(integrations), {
          headers: { 'Content-Type': 'application/json', ...createCORSHeaders(req) }
        });
      }
    },

    '/api/integrations/connect': {
      POST: async (req: Request) => {
        const auth = authMiddleware(req);
        if (auth instanceof Response) return auth;

        try {
          const body = await req.json();
          const integration = {
            id: body.provider,
            name: body.name,
            type: body.type,
            status: 'connected',
            connectedAt: new Date().toISOString()
          };

          return new Response(JSON.stringify(integration), {
            status: 201,
            headers: { 'Content-Type': 'application/json', ...createCORSHeaders(req) }
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: 'Invalid integration data' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...createCORSHeaders(req) }
          });
        }
      }
    },

    '/api/integrations/:id': {
      DELETE: async (req: Request, params: { id: string }) => {
        const auth = authMiddleware(req);
        if (auth instanceof Response) return auth;

        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json', ...createCORSHeaders(req) }
        });
      }
    }
  };
}