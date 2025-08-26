"use client"

import React, { useState } from 'react'
import { useNotifications } from '@/hooks/useNotifications'

export default function NotificationsPage() {
  const { data: items = [], isLoading, markRead } = useNotifications()
  const [page, setPage] = useState(1)
  const pageSize = 20

  const start = (page - 1) * pageSize
  const pageItems = items.slice(start, start + pageSize)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Notifications</h1>
      <div className="mt-4">
        {isLoading ? (
          <div>Loading…</div>
        ) : pageItems.length === 0 ? (
          <div className="text-muted-foreground">No notifications</div>
        ) : (
          <ul className="space-y-2">
            {pageItems.map((n: any) => (
              <li key={n.id} className={`p-3 rounded border ${n.read ? 'bg-card' : 'bg-white'}`}>
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">{n.payload?.alert ?? 'Notification'}</div>
                    <div className="text-xs text-muted-foreground">{new Date(n.created_at).toLocaleString()}</div>
                  </div>
                  <div className="flex gap-2">
                    {!n.read && <button className="btn" onClick={() => markRead.mutate(n.id)}>Mark read</button>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">Page {page}</div>
        <div className="flex gap-2">
          <button className="btn-ghost" onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
          <button className="btn" onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      </div>
    </div>
  )
}
