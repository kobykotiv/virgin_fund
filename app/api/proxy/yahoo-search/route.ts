import { NextRequest, NextResponse } from 'next/server';

// Simple proxy for Yahoo Finance autocomplete/search with small in-memory caching.
// The frontend calls: /api/proxy/yahoo-search?q=apple
// This route forwards the request server-side to Yahoo and returns the JSON result.
// Caching here is intentionally small and in-memory (process-local). For production
// consider Redis or a durable cache. This keeps repeated queries fast and reduces
// outbound calls to Yahoo.

const CACHE_TTL = 1000 * 60 * 5; // 5 minutes
const CACHE_MAX_ENTRIES = 500;
// Simple Map-based cache: key -> { ts, body }
const cache = new Map<string, { ts: number; body: string }>();

function getCache(key: string) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.body;
}

function setCache(key: string, body: string) {
  cache.set(key, { ts: Date.now(), body });
  // enforce simple size bound
  if (cache.size > CACHE_MAX_ENTRIES) {
    const it = cache.keys();
    const first = it.next().value;
    if (first) cache.delete(first);
  }
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') || '';
  const quotesCount = req.nextUrl.searchParams.get('quotesCount') ?? '50';
  const newsCount = req.nextUrl.searchParams.get('newsCount') ?? '0';

  if (!q || q.trim().length === 0) {
    return NextResponse.json({ error: 'missing query parameter q' }, { status: 400 });
  }

  const cacheKey = `${q.trim().toLowerCase()}::${quotesCount}::${newsCount}`;
  const cached = getCache(cacheKey);
  if (cached) {
    // Return cached body with JSON content-type. Keep a short cache-control for downstream proxies.
    return new NextResponse(cached, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `public, max-age=${Math.floor(CACHE_TTL / 1000)}`,
      },
    });
  }

  const yahooUrl = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(
    q,
  )}&quotesCount=${encodeURIComponent(quotesCount)}&newsCount=${encodeURIComponent(newsCount)}`;

  try {
    const res = await fetch(yahooUrl, {
      headers: {
        Accept: 'application/json',
      },
    });

    const data = await res.text();
    // store in cache (best-effort)
    try {
      setCache(cacheKey, data);
    } catch (e) {
      // swallow caching errors
    }

    return new NextResponse(data, {
      status: res.status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `public, max-age=${Math.floor(CACHE_TTL / 1000)}`,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'proxy_error', details: (err as any)?.message ?? String(err) }, { status: 502 });
  }
}
