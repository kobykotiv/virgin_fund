import React from 'react'

export default function ShortcutsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="bg-card rounded shadow-lg p-6 z-10 w-[520px] max-w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Keyboard shortcuts</h3>
          <button onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-2">
            <div className="font-medium">g d</div>
            <div className="text-sm text-muted-foreground">Go to Dashboard</div>
          </div>
          <div className="p-2">
            <div className="font-medium">g s</div>
            <div className="text-sm text-muted-foreground">Go to Signals</div>
          </div>
          <div className="p-2">
            <div className="font-medium">g p</div>
            <div className="text-sm text-muted-foreground">Go to Pipelines</div>
          </div>
          <div className="p-2">
            <div className="font-medium">?</div>
            <div className="text-sm text-muted-foreground">Open this dialog</div>
          </div>
        </div>
      </div>
    </div>
  )
}
