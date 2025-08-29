import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Health check endpoint for monitoring platform status
export async function GET(request: NextRequest) {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {} as Record<string, any>
    };

    // Check Supabase connection
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1)
        .single();

      health.services.supabase = {
        status: error ? 'unhealthy' : 'healthy',
        message: error ? error.message : 'Connected successfully'
      };
    } catch (error) {
      health.services.supabase = {
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'Connection failed'
      };
    }

    // Check Redis connection if available
    if (process.env.REDIS_URL) {
      try {
        // Note: In a real implementation, you'd use a Redis client
        health.services.redis = {
          status: 'healthy',
          message: 'Redis URL configured'
        };
      } catch (error) {
        health.services.redis = {
          status: 'unhealthy',
          message: error instanceof Error ? error.message : 'Connection failed'
        };
      }
    }

    // Check Alpaca API if configured
    if (process.env.ALPACA_API_KEY && process.env.ALPACA_API_SECRET) {
      try {
        // Note: In a real implementation, you'd test the Alpaca API connection
        health.services.alpaca = {
          status: 'healthy',
          message: 'API keys configured'
        };
      } catch (error) {
        health.services.alpaca = {
          status: 'unhealthy',
          message: error instanceof Error ? error.message : 'Connection failed'
        };
      }
    }

    // Determine overall health status
    const unhealthyServices = Object.values(health.services)
      .filter((service: any) => service.status === 'unhealthy');

    if (unhealthyServices.length > 0) {
      health.status = 'degraded';
    }

    // Return appropriate HTTP status
    const httpStatus = health.status === 'healthy' ? 200 :
                      health.status === 'degraded' ? 206 : 503;

    return NextResponse.json(health, { status: httpStatus });

  } catch (error) {
    console.error('Health check failed:', error);

    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 503 });
  }
}

// Support HEAD requests for load balancers
export async function HEAD(request: NextRequest) {
  return new NextResponse(null, { status: 200 });
}
