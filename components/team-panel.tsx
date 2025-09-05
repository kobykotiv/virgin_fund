"use client"

import React, { useEffect, useState } from "react";
import ConfirmModal from "./confirm-modal";
import { useToast } from "./toast-provider";

/**
 * TeamPanel
 *
 * Lists team members and pending invites. Includes an invite form (email + role),
 * role change dropdowns, remove-member action with confirmation, and pending-invite
 * resend / cancel controls.
 *
 * Notes:
 * - Uses `/api/team` endpoints if available; falls back to mock data for local dev.
 * - Keeps interactions optimistic and shows toast feedback for success / errors.
 * - Accessible: form fields have labels, buttons include aria-labels and confirmation modals.
 */

type Role = "admin" | "editor" | "viewer" | string;

interface Member {
  id: string;
  name?: string;
  email: string;
  role: Role;
  joinedAt?: string;
}

interface Invite {
  id: string;
  email: string;
  role: Role;
  invitedAt?: string;
  status?: "pending" | "resent" | string;
}

const MOCK_MEMBERS: Member[] = [
  { id: "m1", name: "Alice Chen", email: "alice@example.com", role: "admin", joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString() },
  { id: "m2", name: "Bob Smith", email: "bob@example.com", role: "editor", joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString() },
];

const MOCK_INVITES: Invite[] = [
  { id: "i1", email: "pending1@example.com", role: "viewer", invitedAt: new Date().toISOString(), status: "pending" },
];

export default function TeamPanel() {
  const [members, setMembers] = useState<Member[] | null>(null);
  const [invites, setInvites] = useState<Invite[] | null>(null);
  const [loading, setLoading] = useState(true);

  // Invite form state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("viewer");
  const [inviteLoading, setInviteLoading] = useState(false);

  // Confirm modal for removing member
  const [confirmRemove, setConfirmRemove] = useState<{ open: boolean; member?: Member | null }>({ open: false, member: null });

  const { push } = useToast();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/team");
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const json = await res.json();
        if (!mounted) return;
        setMembers(Array.isArray(json.members) ? json.members : MOCK_MEMBERS);
        setInvites(Array.isArray(json.invites) ? json.invites : MOCK_INVITES);
      } catch (err) {
        console.warn("Failed to load /api/team - using mock data", err);
        if (mounted) {
          setMembers(MOCK_MEMBERS);
          setInvites(MOCK_INVITES);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || inviteEmail.indexOf("@") === -1) {
      push({ type: "error", message: "Enter a valid email address" });
      return;
    }
    setInviteLoading(true);
    // optimistic
    const tempInvite: Invite = {
      id: `tmp-${Date.now()}`,
      email: inviteEmail,
      role: inviteRole,
      invitedAt: new Date().toISOString(),
      status: "pending",
    };
    setInvites((s) => (s ? [tempInvite, ...s] : [tempInvite]));
    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed" }));
        throw new Error(err?.error || "Invite failed");
      }
      const json = await res.json();
      // replace temporary invite with server-provided invite (if any)
      setInvites((s) => (s ? s.map((inv) => (inv.id === tempInvite.id ? json : inv)) : [json]));
      push({ type: "success", message: `Invite sent to ${inviteEmail}` });
      setInviteEmail("");
      setInviteRole("viewer");
    } catch (err: any) {
      console.error("Invite failed", err);
      push({ type: "error", message: `Failed to send invite: ${err?.message ?? "unknown"}` });
      // remove temp invite
      setInvites((s) => (s ? s.filter((i) => i.id !== tempInvite.id) : null));
    } finally {
      setInviteLoading(false);
    }
  };

  const handleResendInvite = async (inv: Invite) => {
    // optimistic: mark as resent
    setInvites((s) => (s ? s.map((i) => (i.id === inv.id ? { ...i, status: "resent" } : i)) : s));
    try {
      const res = await fetch(`/api/team/invite/${inv.id}/resend`, { method: "POST" });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      push({ type: "success", message: `Invite resent to ${inv.email}` });
    } catch (err) {
      console.warn("Resend failed", err);
      push({ type: "error", message: `Failed to resend invite to ${inv.email}` });
    }
  };

  const handleCancelInvite = async (inv: Invite) => {
    // optimistic remove
    setInvites((s) => (s ? s.filter((i) => i.id !== inv.id) : s));
    try {
      await fetch(`/api/team/invite/${inv.id}`, { method: "DELETE" });
      push({ type: "success", message: `Canceled invite to ${inv.email}` });
    } catch (err) {
      console.warn("Cancel invite failed", err);
      push({ type: "error", message: `Failed to cancel invite to ${inv.email}` });
    }
  };

  const handleChangeRole = async (member: Member, role: Role) => {
    // optimistic update
    setMembers((s) => (s ? s.map((m) => (m.id === member.id ? { ...m, role } : m)) : s));
    try {
      const res = await fetch(`/api/team/${member.id}/role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      push({ type: "success", message: `Role updated for ${member.email}` });
    } catch (err) {
      console.warn("Change role failed", err);
      push({ type: "error", message: `Failed to update role for ${member.email}` });
      // revert (reload members simply)
      try {
        const res = await fetch("/api/team");
        if (res.ok) {
          const json = await res.json();
          setMembers(Array.isArray(json.members) ? json.members : members);
        }
      } catch {
        // ignore
      }
    }
  };

  const handleRemoveConfirmed = async (member: Member | null) => {
    setConfirmRemove({ open: false, member: null });
    if (!member) return;
    // optimistic remove
    setMembers((s) => (s ? s.filter((m) => m.id !== member.id) : s));
    try {
      await fetch(`/api/team/${member.id}`, { method: "DELETE" });
      push({ type: "success", message: `${member.email} removed` });
    } catch (err) {
      console.warn("Remove member failed", err);
      push({ type: "error", message: `Failed to remove ${member.email}` });
    }
  };

  if (loading || !members || !invites) {
    return (
      <div className="p-4 rounded border bg-white dark:bg-gray-900">
        <div className="animate-pulse">
          <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="mt-4 space-y-2">
            <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded" />
            <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded border bg-white dark:bg-gray-900 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Team</h3>
        <div className="text-xs text-gray-500 dark:text-gray-400">Manage members and invites</div>
      </div>

      <form onSubmit={handleInvite} className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
        <div>
          <label className="text-xs text-gray-600 dark:text-gray-300 block">Email</label>
          <input
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            type="email"
            className="mt-1 px-3 py-2 rounded border bg-white dark:bg-gray-800 text-sm w-full"
            placeholder="user@example.com"
            aria-label="Invite email"
          />
        </div>

        <div>
          <label className="text-xs text-gray-600 dark:text-gray-300 block">Role</label>
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            className="mt-1 px-3 py-2 rounded border bg-white dark:bg-gray-800 text-sm w-full"
            aria-label="Invite role"
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div>
          <button
            type="submit"
            disabled={inviteLoading}
            className="px-4 py-2 rounded bg-primary text-white w-full"
            aria-label="Send invite"
          >
            {inviteLoading ? "Sending…" : "Invite"}
          </button>
        </div>
      </form>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <section aria-labelledby="members-heading">
          <h4 id="members-heading" className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Members
          </h4>
          <ul className="space-y-2">
            {members.map((m) => (
              <li key={m.id} className="flex items-center justify-between p-2 rounded border bg-gray-50 dark:bg-gray-800">
                <div>
                  <div className="font-medium text-sm">{m.name ?? m.email}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{m.email}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Joined: {m.joinedAt ? new Date(m.joinedAt).toLocaleDateString() : "—"}</div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={m.role}
                    onChange={(e) => handleChangeRole(m, e.target.value)}
                    className="px-2 py-1 rounded border bg-white dark:bg-gray-800 text-sm"
                    aria-label={`Change role for ${m.email}`}
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>

                  <button
                    onClick={() => setConfirmRemove({ open: true, member: m })}
                    aria-label={`Remove ${m.email}`}
                    className="px-3 py-1 rounded border text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-800"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="invites-heading">
          <h4 id="invites-heading" className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Pending Invites
          </h4>
          <ul className="space-y-2">
            {invites.map((inv) => (
              <li key={inv.id} className="flex items-center justify-between p-2 rounded border bg-gray-50 dark:bg-gray-800">
                <div>
                  <div className="font-medium text-sm">{inv.email}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Role: {inv.role}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Invited: {inv.invitedAt ? new Date(inv.invitedAt).toLocaleDateString() : "—"}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleResendInvite(inv)}
                    className="px-3 py-1 rounded border text-sm"
                    aria-label={`Resend invite to ${inv.email}`}
                  >
                    Resend
                  </button>

                  <button
                    onClick={() => handleCancelInvite(inv)}
                    className="px-3 py-1 rounded border text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-800"
                    aria-label={`Cancel invite to ${inv.email}`}
                  >
                    Cancel
                  </button>
                </div>
              </li>
            ))}
            {invites.length === 0 && <li className="text-sm text-gray-500">No pending invites</li>}
          </ul>
        </section>
      </div>

      <ConfirmModal
        isOpen={confirmRemove.open}
        title={`Remove ${confirmRemove.member?.email ?? "member"}?`}
        description="This will remove the member's access immediately."
        confirmLabel="Remove"
        cancelLabel="Cancel"
        onCancel={() => setConfirmRemove({ open: false, member: null })}
        onConfirm={() => handleRemoveConfirmed(confirmRemove.member ?? null)}
      />
    </div>
  );
}
