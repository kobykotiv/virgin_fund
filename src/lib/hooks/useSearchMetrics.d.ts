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
export declare const useSearchMetrics: import("zustand").UseBoundStore<import("zustand").StoreApi<SearchMetricsStore>>;
export {};
//# sourceMappingURL=useSearchMetrics.d.ts.map