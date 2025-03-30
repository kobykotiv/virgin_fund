/**
 * Error reporting service for Virgin Fund
 * This is a simplified implementation that would be replaced with a real
 * error tracking service like Sentry in production.
 */

interface ErrorMetadata {
  userId?: string;
  portfolioId?: string;
  component?: string;
  additionalData?: Record<string, any>;
}

class ErrorReportingService {
  private isInitialized = false;
  private environment: string;
  
  constructor() {
    this.environment = process.env.REACT_APP_ENVIRONMENT || 'development';
  }
  
  initialize() {
    // In a real implementation, this would initialize an error tracking SDK
    console.log(`[ErrorReporting] Initialized for ${this.environment} environment`);
    this.isInitialized = true;
    
    // Set up global error handler
    this.setupGlobalHandlers();
    
    return this;
  }
  
  private setupGlobalHandlers() {
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.captureException(event.error);
      });
      
      window.addEventListener('unhandledrejection', (event) => {
        this.captureException(event.reason);
      });
    }
  }
  
  captureException(error: Error | unknown, metadata?: ErrorMetadata) {
    if (!this.isInitialized) {
      console.warn('[ErrorReporting] Service not initialized');
      return;
    }
    
    // Convert unknown errors to Error objects
    const normalizedError = error instanceof Error ? error : new Error(String(error));
    
    // In production, this would send the error to a service like Sentry
    console.error('[ErrorReporting] Error captured:', {
      error: normalizedError,
      message: normalizedError.message,
      stack: normalizedError.stack,
      metadata,
      environment: this.environment,
      timestamp: new Date().toISOString()
    });
    
    // In development, we show the full stack trace
    if (this.environment === 'development') {
      console.error(normalizedError);
    }
  }
  
  captureMessage(message: string, metadata?: ErrorMetadata) {
    if (!this.isInitialized) {
      console.warn('[ErrorReporting] Service not initialized');
      return;
    }
    
    console.warn('[ErrorReporting] Message captured:', {
      message,
      metadata,
      environment: this.environment,
      timestamp: new Date().toISOString()
    });
  }
  
  setUser(userId: string) {
    if (!this.isInitialized) {
      console.warn('[ErrorReporting] Service not initialized');
      return;
    }
    
    // In a real implementation, this would set the user context for error tracking
    console.log(`[ErrorReporting] User context set: ${userId}`);
  }
  
  clearUser() {
    if (!this.isInitialized) {
      console.warn('[ErrorReporting] Service not initialized');
      return;
    }
    
    // In a real implementation, this would clear the user context
    console.log('[ErrorReporting] User context cleared');
  }
}

// Create singleton instance
export const errorReporting = new ErrorReportingService();
