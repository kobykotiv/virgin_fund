/**
 * utils/rateLimiter.ts
 *
 * Simple in-memory rate limiter (token-bucket / fixed window) for development/testing.
 * Not suitable for multi-instance production — use Redis or an external rate-limit service.
 *
 * API:
 *  - async check(key: string, limit: number, windowMs: number): Promise<boolean>
 *      returns true if allowed, false if rate-limited
 *
 * Usage:
 *  const ok = await check(clientIp, 10, 60_000);
 */
type Entry = { count: number; resetAt: number };

const store: Map<string, Entry> = new Map();

export async function check(key: string, limit = 10, windowMs = 60_000): Promise<boolean> {
  const now = Date.now();
  const existing = store.get(key);
  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (existing.count >= limit) {
    return false;
  }

  existing.count += 1;
  store.set(key, existing);
  return true;
}

/**
 * Helper to build a stable key from request info.
 */
export function keyFromRequest(req: Request, suffix = ""): string {
  const forwarded = (req as any).headers?.get?.("x-forwarded-for") || (req as any).headers?.get?.("x-real-ip") || "unknown";
  return `${forwarded}:${suffix}`;
}

export default { check, keyFromRequest };
