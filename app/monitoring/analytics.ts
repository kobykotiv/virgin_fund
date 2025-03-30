/**
 * Analytics service for Virgin Fund
 * This is a simplified implementation that would be replaced with a real
 * analytics service like Google Analytics in production.
 */

interface EventProperties {
  [key: string]: string | number | boolean;
}

interface UserProperties {
  userId: string;
  [key: string]: string | number | boolean;
}

interface PageViewProperties {
  path: string;
  title?: string;
  referrer?: string;
}

class AnalyticsService {
  private isInitialized = false;
  private environment: string;
  
  constructor() {
    this.environment = process.env.REACT_APP_ENVIRONMENT || 'development';
  }
  
  initialize() {
    // In a real implementation, this would initialize an analytics SDK
    console.log(`[Analytics] Initialized for ${this.environment} environment`);
    this.isInitialized = true;
    return this;
  }
  
  trackEvent(eventName: string, properties?: EventProperties) {
    if (!this.isInitialized) {
      console.warn('[Analytics] Service not initialized');
      return;
    }
    
    // In production, this would send the event to an analytics service
    console.log('[Analytics] Event tracked:', {
      eventName,
      properties,
      environment: this.environment,
      timestamp: new Date().toISOString()
    });
  }
  
  trackPageView(properties: PageViewProperties) {
    if (!this.isInitialized) {
      console.warn('[Analytics] Service not initialized');
      return;
    }
    
    // In production, this would send the page view to an analytics service
    console.log('[Analytics] Page view tracked:', {
      properties,
      environment: this.environment,
      timestamp: new Date().toISOString()
    });
  }
  
  setUser(properties: UserProperties) {
    if (!this.isInitialized) {
      console.warn('[Analytics] Service not initialized');
      return;
    }
    
    // In a real implementation, this would set the user properties
    console.log('[Analytics] User properties set:', {
      properties,
      environment: this.environment
    });
  }
  
  clearUser() {
    if (!this.isInitialized) {
      console.warn('[Analytics] Service not initialized');
      return;
    }
    
    // In a real implementation, this would clear the user properties
    console.log('[Analytics] User properties cleared');
  }
}

// Create singleton instance
export const analytics = new AnalyticsService();
