import LRU from 'lru-cache';

interface RateLimiterOptions {
  timeWindowMs: number;
  maxRequests: number;
}

const rateLimiter = (options: RateLimiterOptions) => {
  const cache = new LRU<string, { count: number; firstRequestTime: number }>({
    max: 500,
    ttl: options.timeWindowMs,
  });

  return (identifier: string): boolean => {
    const now = Date.now();
    let record = cache.get(identifier);
    if (!record) {
      record = { count: 1, firstRequestTime: now };
      cache.set(identifier, record);
      return true;
    }
    if (record.count < options.maxRequests) {
      record.count += 1;
      cache.set(identifier, record);
      return true;
    }
    // Request limit exceeded
    return false;
  };
};

export default rateLimiter;
