/**
 * Performance monitoring service for Virgin Fund
 * This is a simplified implementation that would be replaced with a real
 * performance monitoring service in production.
 */

interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'percent' | 'count';
  tags?: Record<string, string>;
}

class PerformanceMonitoringService {
  private isInitialized = false;
  private environment: string;
  private metrics: PerformanceMetric[] = [];
  
  constructor() {
    this.environment = process.env.REACT_APP_ENVIRONMENT || 'development';
  }
  
  initialize() {
    // In a real implementation, this would initialize a performance monitoring SDK
    console.log(`[Performance] Initialized for ${this.environment} environment`);
    this.isInitialized = true;
    
    if (typeof window !== 'undefined') {
      this.setupPerformanceObservers();
    }
    
    return this;
  }
  
  private setupPerformanceObservers() {
    // Use Performance Observer API to track key metrics
    try {
      // Track page load metrics
      if ('PerformanceObserver' in window) {
        // Track largest contentful paint
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.recordMetric({
            name: 'largest_contentful_paint',
            value: lastEntry.startTime,
            unit: 'ms'
          });
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        
        // Track first input delay
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach(entry => {
            this.recordMetric({
              name: 'first_input_delay',
              value: entry.processingStart - entry.startTime,
              unit: 'ms'
            });
          });
        });
        fidObserver.observe({ type: 'first-input', buffered: true });
        
        // Track cumulative layout shift
        const clsObserver = new PerformanceObserver((entryList) => {
          let clsValue = 0;
          entryList.getEntries().forEach(entry => {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          });
          this.recordMetric({
            name: 'cumulative_layout_shift',
            value: clsValue,
            unit: 'count'
          });
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      }
    } catch (error) {
      console.error('[Performance] Error setting up performance observers:', error);
    }
  }
  
  startTimer(name: string, tags?: Record<string, string>) {
    if (!this.isInitialized) {
      console.warn('[Performance] Service not initialized');
      return () => {};
    }
    
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      this.recordMetric({
        name,
        value: duration,
        unit: 'ms',
        tags
      });
      
      return duration;
    };
  }
  
  recordMetric(metric: PerformanceMetric) {
    if (!this.isInitialized) {
      console.warn('[Performance] Service not initialized');
      return;
    }
    
    this.metrics.push(metric);
    
    // In a real implementation, this might batch and send metrics to a monitoring service
    console.log('[Performance] Metric recorded:', {
      ...metric,
      environment: this.environment,
      timestamp: new Date().toISOString()
    });
  }
  
  getMetrics() {
    return this.metrics;
  }
}

// Create singleton instance
export const performanceMonitoring = new PerformanceMonitoringService();
