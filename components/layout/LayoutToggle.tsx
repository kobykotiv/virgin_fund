"use client"

import React from 'react'
import { useLayout } from './LayoutContext'

export function LayoutToggle() {
  const { mode, setMode } = useLayout()
  return (
    <div className="flex items-center gap-2">
      <label className="sr-only">Layout</label>
      <select
        value={mode}
        onChange={(e) => setMode(e.target.value as any)}
        className="rounded border px-2 py-1 text-sm"
        aria-label="Select layout"
      >
        <option value="responsive">Responsive</option>
        <option value="grid">Grid</option>
        <option value="desktop">Desktop</option>
      </select>
    </div>
  )
}
