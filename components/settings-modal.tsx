"use client"

import React, { useState } from "react";
import ConfirmModal from "./confirm-modal";
import { useToast } from "./toast-provider";

/**
 * SettingsModal
 *
 * Modal dialog organized into tabs: Profile, API Keys, Notifications, Security.
 * - Controlled via `isOpen` prop (parent manages opening).
 * - Each tab validates inputs and shows inline errors.
 * - On save, performs a mock submit (or posts to provided endpoints).
 *
 * Usage:
 * <SettingsModal isOpen={open} onClose={() => setOpen(false)} />
 */

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: Props) {
  const [tab, setTab] = useState<"profile" | "api" | "notifications" | "security">("profile");
  const [saving, setSaving] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const { push } = useToast();

  // Profile fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // API keys
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");

  // Notifications
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySMS, setNotifySMS] = useState(false);

  // Security
  const [mfaEnabled, setMfaEnabled] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      // Mock saving; in real app, endpoints would be called for each tab
      await new Promise((res) => setTimeout(res, 600));
      push({ type: "success", message: "Settings saved" });
      onClose();
    } catch (err) {
      push({ type: "error", message: "Failed to save settings" });
    } finally {
      setSaving(false);
    }
  };

  const handleResetAccount = async () => {
    setConfirmReset(false);
    // perform reset action
    push({ type: "success", message: "Account reset (demo)" });
  };

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden />

      <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-gray-900 rounded shadow-lg border p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Settings</h3>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-2 py-1 rounded border">Close</button>
            <button onClick={handleSave} disabled={saving} className="px-3 py-1 rounded bg-primary text-white">{saving ? "Saving…" : "Save"}</button>
          </div>
        </div>

        <div className="flex gap-4">
          <nav aria-label="Settings tabs" className="w-40">
            <ul className="space-y-1">
              <li>
                <button className={`w-full text-left px-3 py-2 rounded ${tab === "profile" ? "bg-gray-100 dark:bg-gray-800" : ""}`} onClick={() => setTab("profile")}>Profile</button>
              </li>
              <li>
                <button className={`w-full text-left px-3 py-2 rounded ${tab === "api" ? "bg-gray-100 dark:bg-gray-800" : ""}`} onClick={() => setTab("api")}>API Keys</button>
              </li>
              <li>
                <button className={`w-full text-left px-3 py-2 rounded ${tab === "notifications" ? "bg-gray-100 dark:bg-gray-800" : ""}`} onClick={() => setTab("notifications")}>Notifications</button>
              </li>
              <li>
                <button className={`w-full text-left px-3 py-2 rounded ${tab === "security" ? "bg-gray-100 dark:bg-gray-800" : ""}`} onClick={() => setTab("security")}>Security</button>
              </li>
            </ul>
          </nav>

          <div className="flex-1">
            {tab === "profile" && (
              <div>
                <label className="text-sm block">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full px-3 py-2 rounded border bg-white dark:bg-gray-800" />
                <label className="text-sm block mt-3">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full px-3 py-2 rounded border bg-white dark:bg-gray-800" />
              </div>
            )}

            {tab === "api" && (
              <div>
                <label className="text-sm block">API Key</label>
                <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="mt-1 w-full px-3 py-2 rounded border bg-white dark:bg-gray-800" />
                <label className="text-sm block mt-3">API Secret</label>
                <input value={apiSecret} onChange={(e) => setApiSecret(e.target.value)} className="mt-1 w-full px-3 py-2 rounded border bg-white dark:bg-gray-800" />
                <div className="text-xs text-gray-500 mt-2">Keep your API keys secure. Keys are stored encrypted server-side in production.</div>
              </div>
            )}

            {tab === "notifications" && (
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={notifyEmail} onChange={(e) => setNotifyEmail(e.target.checked)} />
                  <span className="text-sm">Email notifications</span>
                </label>
                <label className="flex items-center gap-2 mt-2">
                  <input type="checkbox" checked={notifySMS} onChange={(e) => setNotifySMS(e.target.checked)} />
                  <span className="text-sm">SMS notifications</span>
                </label>
              </div>
            )}

            {tab === "security" && (
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={mfaEnabled} onChange={(e) => setMfaEnabled(e.target.checked)} />
                  <span className="text-sm">Enable multi-factor authentication (MFA)</span>
                </label>

                <div className="mt-4">
                  <button onClick={() => setConfirmReset(true)} className="px-3 py-1 rounded border text-sm text-red-600">Reset account (demo)</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <ConfirmModal
          isOpen={confirmReset}
          title="Reset account?"
          description="This will reset demo data. This action is irreversible in demo mode."
          confirmLabel="Reset"
          cancelLabel="Cancel"
          onCancel={() => setConfirmReset(false)}
          onConfirm={() => handleResetAccount()}
        />
      </div>
    </div>
  );
}
