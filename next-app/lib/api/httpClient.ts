import axios, { AxiosResponse, AxiosError } from 'axios';

/**
 * HTTP Client with authentication, retry logic, and error handling
 * Provides a centralized way to make API calls with proper auth headers
 */

// Base configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types for authentication
interface AuthConfig {
  token?: string;
  tenantId?: string;
}

// Storage for auth config
let authConfig: AuthConfig = {};

/**
 * Set authentication configuration
 */
export function setAuth(token: string, tenantId: string) {
  authConfig = { token, tenantId };
  
  // Update default headers
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  if (tenantId) {
    apiClient.defaults.headers.common['x-tenant-id'] = tenantId;
  }
}

/**
 * Clear authentication
 */
export function clearAuth() {
  authConfig = {};
  delete apiClient.defaults.headers.common['Authorization'];
  delete apiClient.defaults.headers.common['x-tenant-id'];
}

/**
 * Get current auth configuration
 */
export function getAuth(): AuthConfig {
  return authConfig;
}

/**
 * Request interceptor to add auth headers
 */
apiClient.interceptors.request.use(
  (config) => {
    // Add auth headers if available
    if (authConfig.token && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${authConfig.token}`;
    }
    if (authConfig.tenantId && !config.headers['x-tenant-id']) {
      config.headers['x-tenant-id'] = authConfig.tenantId;
    }

    // Add timestamp for debugging
    config.headers['X-Request-Time'] = new Date().toISOString();

    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling and retries
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    console.error(`API Error: ${error.response?.status} ${error.config?.url}`, error.message);

    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      console.warn('Authentication failed - clearing auth');
      clearAuth();
      
      // Redirect to login if in browser
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      
      return Promise.reject(error);
    }

    // Handle 403 Forbidden - insufficient permissions
    if (error.response?.status === 403) {
      console.warn('Insufficient permissions');
      return Promise.reject(error);
    }

    // Retry logic for network errors and 5xx errors
    const shouldRetry = (
      !originalRequest._retry &&
      originalRequest._retryCount < MAX_RETRIES &&
      (
        !error.response || // Network error
        error.response.status >= 500 || // Server error
        error.response.status === 429 // Rate limited
      )
    );

    if (shouldRetry) {
      originalRequest._retry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

      // Calculate delay with exponential backoff
      const delay = RETRY_DELAY * Math.pow(2, originalRequest._retryCount - 1);
      
      console.log(`Retrying request ${originalRequest._retryCount}/${MAX_RETRIES} after ${delay}ms`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return apiClient(originalRequest);
    }

    return Promise.reject(error);
  }
);

/**
 * Generic API request function with type safety
 */
export async function apiRequest<T = any>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  data?: any,
  config?: any
): Promise<T> {
  try {
    const response = await apiClient.request<T>({
      method,
      url,
      data,
      ...config,
    });
    
    return response.data;
  } catch (error) {
    // Enhanced error handling
    if (axios.isAxiosError(error)) {
      const apiError = {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
      };
      
      console.error('API Request failed:', apiError);
      throw apiError;
    }
    
    throw error;
  }
}

/**
 * Convenience methods for different HTTP verbs
 */
export const httpClient = {
  get: <T = any>(url: string, config?: any) => 
    apiRequest<T>('GET', url, undefined, config),
  
  post: <T = any>(url: string, data?: any, config?: any) => 
    apiRequest<T>('POST', url, data, config),
  
  put: <T = any>(url: string, data?: any, config?: any) => 
    apiRequest<T>('PUT', url, data, config),
  
  patch: <T = any>(url: string, data?: any, config?: any) => 
    apiRequest<T>('PATCH', url, data, config),
  
  delete: <T = any>(url: string, config?: any) => 
    apiRequest<T>('DELETE', url, undefined, config),
};

/**
 * Health check function
 */
export async function healthCheck(): Promise<boolean> {
  try {
    await httpClient.get('/health');
    return true;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
}

/**
 * Authentication helper
 */
export async function getDemoToken(userId = 'demo-user', tenantId = 'demo-tenant') {
  try {
    const response = await httpClient.post('/api/auth/demo-token', {
      userId,
      tenantId,
    });
    
    return response;
  } catch (error) {
    console.error('Failed to get demo token:', error);
    throw error;
  }
}

export default apiClient;