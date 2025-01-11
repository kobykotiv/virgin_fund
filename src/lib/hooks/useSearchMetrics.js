import { create } from 'zustand';
const initialState = {
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
export const useSearchMetrics = create((set) => ({
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
    addResponseTime: (time) => set((state) => {
        const responseTimes = [...state.responseTimes, time].slice(-100); // Keep last 100 times
        const averageResponseTime = Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length);
        return {
            responseTimes,
            averageResponseTime,
            lastUpdated: new Date()
        };
    }),
    updateRateLimit: (remaining) => set({
        rateLimitRemaining: remaining,
        lastUpdated: new Date()
    }),
    recordError: (code) => set((state) => ({
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
