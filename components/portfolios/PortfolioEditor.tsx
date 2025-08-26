"use client"

import React, { useState, useEffect } from 'react'

export default function PortfolioEditor({ initial, onClose }: { initial?: any; onClose: () => void }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setName(initial?.name ?? '')
    setDescription(initial?.description ?? '')
  }, [initial])

  async function handleSave() {
    setSaving(true)
    try {
      const payload = { name, description }
      // call API: POST /api/portfolios/create or PATCH /api/portfolios/:id
      if (initial?.id) {
        await fetch(`/api/portfolios/${initial.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      } else {
        await fetch('/api/portfolios/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      }
      onClose()
    } catch (e) {
      // noop
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-4 bg-white dark:bg-slate-900 rounded shadow">
      <h3 className="text-lg font-semibold">{initial ? 'Edit Portfolio' : 'Create Portfolio'}</h3>
      <div className="grid gap-2 mt-3">
        <label className="flex flex-col">
          <span className="text-sm">Name</span>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="flex flex-col">
          <span className="text-sm">Description</span>
          <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>

        <div className="flex gap-2 mt-2">
          <button className="btn" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          <button className="btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
