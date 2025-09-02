import { WebSocketServer } from 'ws';
import { WSManager } from './utils/wsManager.js';
import { createAPIRoutes } from './routes/api.js';
import { handleCORS, createCORSHeaders, generateDemoToken } from './utils/auth.js';

// Environment configuration
const PORT = parseInt(process.env.PORT || '3001');
const HOST = process.env.HOST || 'localhost';

// Initialize WebSocket manager
const wsManager = new WSManager();

// Create API routes with WebSocket manager
const apiRoutes = createAPIRoutes(wsManager);

/**
 * Main Bun server for Trading Agent middleware backend
 * 
 * Features:
 * - REST API with comprehensive trading endpoints
 * - WebSocket support for real-time updates
 * - JWT authentication with tenant isolation
 * - Python CLI integration for analysis jobs
 * - CORS support for frontend development
 */
const server = Bun.serve({
  port: PORT,
  hostname: HOST,
  
  fetch: async (req, server) => {
    const url = new URL(req.url);
    console.log(`${req.method} ${url.pathname}`);

    // Handle CORS preflight requests
    const corsResponse = handleCORS(req);
    if (corsResponse) return corsResponse;

    try {
      // WebSocket upgrade handling
      if (req.headers.get('upgrade') === 'websocket') {
        const upgraded = server.upgrade(req, {
          data: { url: req.url, headers: req.headers }
        });
        
        if (!upgraded) {
          return new Response('WebSocket upgrade failed', { status: 426 });
        }
        return undefined;
      }

      // Demo token generation endpoint (for development)
      if (url.pathname === '/api/auth/demo-token' && req.method === 'POST') {
        try {
          const body = await req.json();
          const { userId = 'demo-user', tenantId = 'demo-tenant' } = body;
          
          const token = generateDemoToken(userId, tenantId);
          
          return new Response(JSON.stringify({ 
            token,
            expiresIn: '24h',
            user: { userId, tenantId }
          }), {
            headers: { 'Content-Type': 'application/json', ...createCORSHeaders(req) }
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: 'Invalid request' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...createCORSHeaders(req) }
          });
        }
      }

      // Health check endpoint
      if (url.pathname === '/health') {
        return new Response(JSON.stringify({ 
          status: 'healthy',
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        }), {
          headers: { 'Content-Type': 'application/json', ...createCORSHeaders(req) }
        });
      }

      // API route handling
      const route = findMatchingRoute(url.pathname, req.method);
      if (route) {
        const { handler, params } = route;
        return await handler(req, params);
      }

      // 404 Not Found
      return new Response(JSON.stringify({ 
        error: 'Route not found',
        path: url.pathname,
        method: req.method
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...createCORSHeaders(req) }
      });

    } catch (error) {
      console.error('Server error:', error);
      
      return new Response(JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...createCORSHeaders(req) }
      });
    }
  },

  websocket: {
    message: () => {}, // Handled by WSManager
    open: (ws) => {
      const data = ws.data as { url: string; headers: Headers };
      const request = new Request(data.url, { headers: data.headers });
      wsManager.handleConnection(ws, request);
    },
    close: () => {}, // Handled by WSManager
    error: (ws, error) => {
      console.error('WebSocket error:', error);
    }
  }
});

/**
 * Find matching route from API routes
 */
function findMatchingRoute(pathname: string, method: string) {
  for (const [routePath, methods] of Object.entries(apiRoutes)) {
    if (typeof methods === 'object' && methods !== null) {
      const handler = (methods as any)[method];
      if (handler) {
        const match = matchRoute(routePath, pathname);
        if (match) {
          return { handler, params: match.params };
        }
      }
    }
  }
  return null;
}

/**
 * Match route pattern with actual path and extract parameters
 */
function matchRoute(pattern: string, path: string) {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);

  if (patternParts.length !== pathParts.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];

    if (patternPart.startsWith(':')) {
      // Parameter
      const paramName = patternPart.slice(1);
      params[paramName] = pathPart;
    } else if (patternPart !== pathPart) {
      // Literal mismatch
      return null;
    }
  }

  return { params };
}

// Graceful shutdown handling
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  wsManager.destroy();
  server.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down server...');
  wsManager.destroy();
  server.stop();
  process.exit(0);
});

console.log(`🚀 Trading Agent Backend Server running on http://${HOST}:${PORT}`);
console.log(`📊 WebSocket endpoint: ws://${HOST}:${PORT}/ws`);
console.log(`🔍 Health check: http://${HOST}:${PORT}/health`);
console.log(`🔑 Demo token: http://${HOST}:${PORT}/api/auth/demo-token`);

export { server };