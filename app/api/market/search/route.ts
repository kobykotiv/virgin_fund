import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') || ''
  if (!q) return NextResponse.json({ quotes: [] })

  // Prefer server-side proxy endpoints that handle Coingecko/Yahoo and rate limiting.
  // This route forwards to /api/proxy/coingecko-search (not yet implemented) or returns an empty list.
  try {
    const res = await fetch(`${req.nextUrl.origin}/api/proxy/coingecko-search?q=${encodeURIComponent(q)}`)
    if (!res.ok) return NextResponse.json({ quotes: [] })
    const json = await res.json()
    return NextResponse.json({ quotes: json?.coins ?? json?.quotes ?? [] })
  } catch (e) {
    return NextResponse.json({ quotes: [] })
  }
}
