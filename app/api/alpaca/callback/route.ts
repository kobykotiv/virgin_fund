import { NextResponse } from 'next/server'
import { exchangeCodeForToken, persistToken } from '@/lib/server/alpaca'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 })
  }

  try {
    const token = await exchangeCodeForToken(code)

    // TODO: Persist token for the current authenticated user.
    // You must wire this into your auth system (session/user id).
    // Example: await persistToken(userId, token)
    // For now we call persistToken which is a placeholder that should be implemented.
    await persistToken(token)

    // send simple HTML that posts message to opener and closes popup
    const html = `<!doctype html>
<html>
  <head><meta charset="utf-8"></head>
  <body>
    <script>
      try {
        window.opener.postMessage({ type: 'ALPACA_CONNECTED', data: { status: 'ok' } }, window.origin);
      } catch (e) {
        // ignore
      }
      setTimeout(() => window.close(), 500);
    </script>
    <div style="font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:24px;">Connecting...</div>
  </body>
</html>`

    return new Response(html, { headers: { 'Content-Type': 'text/html' } })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 })
  }
}
