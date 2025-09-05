import { parse } from 'cookie'
import { verifySessionToken } from './session'
import { getSupabaseAdmin } from './supabaseAdmin'

type RoleResult = {
  userId: string | null
  role: string | null
}

/**
 * Resolve the user's role from the request.
 * - First tries to read role from the verified JWT payload if present.
 * - If not present and Supabase admin client is available, looks up `team_members` by user id.
 * - Falls back to sensible defaults for local/demo users.
 *
 * This helper intentionally returns a simple structure to make RBAC checks concise in API routes.
 */
export async function getUserRoleFromRequest(req: Request, supabaseClient?: any): Promise<RoleResult> {
  try {
    const cookies = parse(req.headers.get('cookie') || '')
    const token = cookies['vf_session'] || ''
    const payload: any = await verifySessionToken(token)
    if (!payload) return { userId: null, role: null }

    const userId = payload.user_id || payload.sub || payload.id || null
    // Common JWT claim names we might use for role
    let role = (payload as any).role || (payload as any).user_role || null

    const supabase = supabaseClient ?? getSupabaseAdmin()
    if (!role && supabase && userId) {
      try {
        const { data, error } = await supabase.from('team_members').select('role').eq('id', userId).maybeSingle()
        if (!error && data && (data as any).role) role = (data as any).role
      } catch (err) {
        // best-effort: ignore DB lookup errors and fallback below
      }
    }

    // Fallback defaults in dev/demo:
    if (!role) {
      if (userId && userId.toString().startsWith('user_demo')) {
        role = 'admin'
      } else {
        role = 'viewer'
      }
    }

    return { userId, role }
  } catch (err) {
    return { userId: null, role: null }
  }
}
