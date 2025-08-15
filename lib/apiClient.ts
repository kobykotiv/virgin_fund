import { supabase } from '@/lib/supabaseClient'

async function getAccessToken(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getSession()
    return data.session?.access_token ?? null
  } catch (err) {
    console.error('Failed to get access token', err)
    return null
  }
}

async function authFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getAccessToken()
  const headers = new Headers(options.headers || {})
  if (token) headers.set('Authorization', `Bearer ${token}`)

  // ensure JSON content type for body requests unless explicitly set
  if (!headers.get('Content-Type') && options.method && options.method !== 'GET') {
    headers.set('Content-Type', 'application/json')
  }

  const res = await fetch(path, { ...options, headers })
  const text = await res.text()
  const contentType = res.headers.get('content-type') || ''

  if (!res.ok) {
    let body: any = text
    try { body = contentType.includes('application/json') ? JSON.parse(text) : text } catch {}
    const errMsg = (body && (body.error || body.message)) || res.statusText || 'Request failed'
    const e = new Error(errMsg) as any
    e.status = res.status
    e.body = body
    throw e
  }

  if (!text) return null as any
  try {
    return contentType.includes('application/json') ? JSON.parse(text) : (text as any)
  } catch {
    return text as any
  }
}

export async function apiGet<T = any>(path: string) {
  return authFetch<T>(path, { method: 'GET' })
}

export async function apiPost<T = any>(path: string, body?: any) {
  return authFetch<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined })
}

export async function apiPut<T = any>(path: string, body?: any) {
  return authFetch<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined })
}

export async function apiDelete<T = any>(path: string, body?: any) {
  return authFetch<T>(path, { method: 'DELETE', body: body ? JSON.stringify(body) : undefined })
}
