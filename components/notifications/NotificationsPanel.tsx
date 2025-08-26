"use client"

import React from 'react'
import { useNotifications } from '@/hooks/useNotifications'
import { Button } from '@/components/ui/button'

export default function NotificationsPanel() {
  const query = useNotifications()
  const items = query.data ?? []

  const handleMarkAll = async () => {
    try {
      for (const it of items) {
        if (!it.read) await query.markRead.mutateAsync(it.id);
      }
    } catch (e) {
      console.error('mark all read failed', e);
    }
  }

  return (
    <div className="p-3 bg-card rounded shadow max-h-80 overflow-auto">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium">Notifications</h4>
        <Button variant="ghost" size="sm" onClick={handleMarkAll}>Mark all read</Button>
      </div>
      <ul className="space-y-2 text-sm">
  {items.length === 0 && <li className="text-muted-foreground">No notifications</li>}
  {items.map((n: any) => (
          <li key={n.id} className="p-2 border rounded flex items-start justify-between">
            <div>
              <div className="font-medium">{n.title ?? 'Alert'}</div>
              <div className="text-xs text-muted-foreground">{n.message}</div>
              <div className="text-xs text-muted-foreground">{new Date(n.created_at).toLocaleString()}</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {!n.read && <Button size="sm" variant="outline" onClick={() => query.markRead.mutateAsync(n.id)}>Mark read</Button>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
