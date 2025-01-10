import { create } from 'zustand';

interface SearchMetrics {
  cacheHits: number;
  apiCalls: number;
  averageResponseTime: number;
  retryCount: number;
  lastUpdated: Date;
  rateLimitRemaining: number;
  responseTimes: number[];
  errors: {
    count: number;
    lastError?: {
      code: string;
      timestamp: number;
    };
  };
}

interface SearchMetricsStore extends SearchMetrics {
  incrementCacheHits: () => void;
  incrementApiCalls: () => void;
  incrementRetries: () => void;
  addResponseTime: (time: number) => void;
  updateRateLimit: (remaining: number) => void;
  recordError: (code: string) => void;
  reset: () => void;
}

const initialState: SearchMetrics = {
  cacheHits: 0,
  apiCalls: 0,
  averageResponseTime: 0,
  retryCount: 0,
  lastUpdated: new Date(),
  rateLimitRemaining: 5,
  responseTimes: [],
  errors: {
    count: 0
  }
};

export const useSearchMetrics = create<SearchMetricsStore>((set) => ({
  ...initialState,
  
  incrementCacheHits: () => set((state) => ({ 
    cacheHits: state.cacheHits + 1,
    lastUpdated: new Date()
  })),
  
  incrementApiCalls: () => set((state) => ({ 
    apiCalls: state.apiCalls + 1,
    lastUpdated: new Date()
  })),

  incrementRetries: () => set((state) => ({
    retryCount: state.retryCount + 1,
    lastUpdated: new Date()
  })),
  
  addResponseTime: (time: number) => set((state) => {
    const responseTimes = [...state.responseTimes, time].slice(-100); // Keep last 100 times
    const averageResponseTime = Math.round(
      responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    );
    return {
      responseTimes,
      averageResponseTime,
      lastUpdated: new Date()
    };
  }),
  
  updateRateLimit: (remaining: number) => set({ 
    rateLimitRemaining: remaining,
    lastUpdated: new Date()
  }),
  
  recordError: (code: string) => set((state) => ({
    errors: {
      count: state.errors.count + 1,
      lastError: {
        code,
        timestamp: Date.now()
      }
    }
  })),
  
  reset: () => set(initialState),
}));