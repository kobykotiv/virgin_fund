import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'cookie'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { verifySessionToken } from '@/lib/session'
import { getUserRoleFromRequest } from '@/lib/rbac'

type Invite = {
  id: string
  email: string
  role: string
  inviter_id?: string | null
  created_at: string
  sent_at?: string | null
  accepted_at?: string | null
  status?: 'pending' | 'accepted' | 'declined' | 'canceled'
  resend_count?: number
}

type Member = {
  id: string
  email: string
  role: string
  joined_at: string
  inviter_id?: string | null
}

/**
 * Lightweight in-memory storage for invites & members when Supabase isn't configured.
 * Enables UI flows for local/dev mode.
 */
const MOCK_INVITES: Invite[] = [
  {
    id: 'invite_demo_1',
    email: 'alice@example.com',
    role: 'manager',
    inviter_id: 'user_demo_admin',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    sent_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    status: 'pending',
    resend_count: 0,
  },
]

const MOCK_MEMBERS: Member[] = [
  {
    id: 'member_demo_1',
    email: 'owner@example.com',
    role: 'admin',
    joined_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    inviter_id: null,
  },
]

function generateId(prefix = 'inv') {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}

function validateCreateInvite(payload: any) {
  if (!payload) return { valid: false, message: 'Missing payload' }
  if (!payload.email || typeof payload.email !== 'string' || !payload.email.includes('@')) {
    return { valid: false, message: 'Valid email is required.' }
  }
  if (!payload.role || typeof payload.role !== 'string' || payload.role.trim().length === 0) {
    return { valid: false, message: 'Role is required.' }
  }
  return { valid: true }
}

/**
 * GET: list invites (and optionally members) - server requires admin/session to view invites; if Supabase not configured, return mocks
 */
export async function GET(req: NextRequest) {
  const supabase = getSupabaseAdmin()
  try {
    const cookies = parse(req.headers.get('cookie') || '')
    const session = await verifySessionToken(cookies['vf_session'] || '')
    if (!session || (session as any).expired) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = (session as any).user_id

    if (!supabase) {
      // Return all mock invites and members for demo purposes
      return NextResponse.json({ invites: MOCK_INVITES, members: MOCK_MEMBERS })
    }

    const [{ data: invites, error: invitesErr }, { data: members, error: membersErr }] = await Promise.all([
      supabase.from('team_invites').select('*'),
      supabase.from('team_members').select('*'),
    ])

    if (invitesErr || membersErr) {
      const msg = invitesErr?.message || membersErr?.message || 'DB error'
      return NextResponse.json({ error: msg }, { status: 500 })
    }

    return NextResponse.json({ invites, members })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}

/**
 * POST: create a new invite (requires auth). Body: { email, role }
 */
export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdmin()
  try {
    const cookies = parse(req.headers.get('cookie') || '')
    const session = await verifySessionToken(cookies['vf_session'] || '')
    if (!session || (session as any).expired) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const inviterId = (session as any).user_id
    const { userId, role } = await getUserRoleFromRequest(req, supabase)
    if (!role || !['admin', 'manager'].includes(role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await req.json().catch(() => ({} as any))
    const v = validateCreateInvite(body)
    if (!v.valid) return NextResponse.json({ error: v.message }, { status: 400 })

    const invite: Invite = {
      id: generateId('invite'),
      email: body.email.toLowerCase(),
      role: body.role,
      inviter_id: inviterId,
      created_at: new Date().toISOString(),
      sent_at: new Date().toISOString(),
      status: 'pending',
      resend_count: 0,
    }

    if (!supabase) {
      MOCK_INVITES.unshift(invite)
      return NextResponse.json({ invite }, { status: 201 })
    }

    try {
      const { data, error } = await supabase.from('team_invites').insert([invite]).select().maybeSingle()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      // Optionally: send email invite here (best-effort)
      return NextResponse.json({ invite: data }, { status: 201 })
    } catch (err: any) {
      return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}

/**
 * PATCH: perform invite lifecycle actions:
 * Body: { id, action } where action in ['accept','decline','resend','cancel']
 *
 * - accept: create team_member (if supabase) and mark invite accepted
 * - decline: mark invite declined
 * - resend: update sent_at & increment resend_count (and optionally re-send email)
 * - cancel: mark canceled (or delete)
 *
 * Accept can be called without session to simulate invite link usage (requires invite id + email)
 */
export async function PATCH(req: NextRequest) {
  const supabase = getSupabaseAdmin()
  const body = await req.json().catch(() => ({} as any))
  const action = (body.action || '').toString().toLowerCase()
  const id = body.id

  if (!id) return NextResponse.json({ error: 'Missing invite id' }, { status: 400 })
  if (!['accept', 'decline', 'resend', 'cancel'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  // Require RBAC for non-accept actions (resend/cancel/decline)
  if (action !== 'accept') {
    const { userId, role } = await getUserRoleFromRequest(req, supabase)
    if (!role || !['admin', 'manager'].includes(role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }
  }

  try {
    if (!supabase) {
      const idx = MOCK_INVITES.findIndex((i) => i.id === id)
      if (idx === -1) return NextResponse.json({ error: 'Invite not found' }, { status: 404 })
      const inv = MOCK_INVITES[idx]

      if (action === 'resend') {
        inv.sent_at = new Date().toISOString()
        inv.resend_count = (inv.resend_count || 0) + 1
        MOCK_INVITES[idx] = inv
        return NextResponse.json({ invite: inv })
      }

      if (action === 'cancel') {
        inv.status = 'canceled'
        MOCK_INVITES.splice(idx, 1)
        return NextResponse.json({ success: true })
      }

      if (action === 'decline') {
        inv.status = 'declined'
        MOCK_INVITES[idx] = inv
        return NextResponse.json({ invite: inv })
      }

      if (action === 'accept') {
        // optional email check for accept flow
        const acceptEmail = (body.email || '').toString().toLowerCase()
        if (acceptEmail && acceptEmail !== inv.email) {
          return NextResponse.json({ error: 'Email does not match invite' }, { status: 400 })
        }
        inv.status = 'accepted'
        inv.accepted_at = new Date().toISOString()
        MOCK_INVITES[idx] = inv

        // create mock member
        const member: Member = {
          id: generateId('member'),
          email: inv.email,
          role: inv.role,
          joined_at: new Date().toISOString(),
          inviter_id: inv.inviter_id ?? null,
        }
        MOCK_MEMBERS.unshift(member)
        return NextResponse.json({ invite: inv, member })
      }
    }

    // Supabase-backed actions
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    if (action === 'resend') {
      const updates = { sent_at: new Date().toISOString() }
      const { data, error } = await supabase.from('team_invites').update(updates).eq('id', id).select().maybeSingle()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      // TODO: send actual email via mailer
      return NextResponse.json({ invite: data })
    }

    if (action === 'cancel' || action === 'decline') {
      const status = action === 'cancel' ? 'canceled' : 'declined'
      const { data, error } = await supabase.from('team_invites').update({ status }).eq('id', id).select().maybeSingle()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ invite: data })
    }

    if (action === 'accept') {
      // Accept flow: find invite, create member, mark invite accepted
      const { data: inviteData, error: inviteErr } = await supabase.from('team_invites').select('*').eq('id', id).maybeSingle()
      if (inviteErr) return NextResponse.json({ error: inviteErr.message }, { status: 500 })
      if (!inviteData) return NextResponse.json({ error: 'Invite not found' }, { status: 404 })

      // optional email validation when provided in body
      if (body.email && body.email.toLowerCase() !== inviteData.email?.toLowerCase()) {
        return NextResponse.json({ error: 'Email does not match invite' }, { status: 400 })
      }

      const memberPayload = {
        email: inviteData.email,
        role: inviteData.role,
        joined_at: new Date().toISOString(),
        inviter_id: inviteData.inviter_id ?? null,
      }

      const { data: memberCreated, error: memberErr } = await supabase.from('team_members').insert([memberPayload]).select().maybeSingle()
      if (memberErr) return NextResponse.json({ error: memberErr.message }, { status: 500 })

      const { data: updatedInvite, error: updateErr } = await supabase
        .from('team_invites')
        .update({ status: 'accepted', accepted_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .maybeSingle()

      if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 })
      return NextResponse.json({ invite: updatedInvite, member: memberCreated })
    }

    return NextResponse.json({ error: 'Unhandled action' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}

/**
 * DELETE: remove/cancel an invite (requires auth)
 * Body: { id }
 */
export async function DELETE(req: NextRequest) {
  const supabase = getSupabaseAdmin()
  try {
    const cookies = parse(req.headers.get('cookie') || '')
    const session = await verifySessionToken(cookies['vf_session'] || '')
    if (!session || (session as any).expired) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { userId, role } = await getUserRoleFromRequest(req, supabase)
    if (!role || !['admin', 'manager'].includes(role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await req.json().catch(() => ({} as any))
    const id = body.id
    if (!id) return NextResponse.json({ error: 'Missing invite id' }, { status: 400 })

    if (!supabase) {
      const idx = MOCK_INVITES.findIndex((i) => i.id === id)
      if (idx === -1) return NextResponse.json({ error: 'Invite not found' }, { status: 404 })
      MOCK_INVITES.splice(idx, 1)
      return NextResponse.json({ success: true })
    }

    const { error } = await supabase.from('team_invites').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}
