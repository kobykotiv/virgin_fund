import React, { useState } from "react"
import Link from "next/link"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/user-avatar"
import { useNotifications } from "@/hooks/useNotifications"

export default function Topbar() {
  // Small presentational topbar showing balances, notifications and profile
  const [open, setOpen] = useState(false);
  const { data: notifications = [], isLoading, markRead } = useNotifications();
  const unreadCount = (notifications || []).filter((n: any) => !n.read).length;
  return (
    <header className="h-16 px-6 flex items-center justify-between border-b bg-background/80 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className="text-xl font-semibold">Dashboard</div>

        <div className="hidden sm:flex items-center gap-3 ml-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-2xl bg-muted/40 shadow-sm">
            <div className="text-xs text-muted-foreground">USD</div>
            <div className="text-sm font-medium">$45,231</div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-2xl bg-muted/40 shadow-sm">
            <div className="text-xs text-muted-foreground">BTC</div>
            <div className="text-sm font-medium">0.832</div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-2xl bg-muted/40 shadow-sm">
            <div className="text-xs text-muted-foreground">ETH</div>
            <div className="text-sm font-medium">2.14</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Button className="p-2" onClick={() => setOpen((s) => !s)}>
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs bg-red-600 text-white">{unreadCount}</span>
            )}
          </Button>

          {open && (
            <div className="absolute right-0 mt-2 w-80 bg-popover border rounded shadow-lg z-50 p-2">
              <div className="flex items-center justify-between px-2 py-1">
                <div className="font-medium">Notifications</div>
                <div className="text-xs text-muted-foreground">{notifications?.length ?? 0}</div>
              </div>
              <div className="max-h-60 overflow-auto mt-2">
                {isLoading ? (
                  <div className="p-2 text-sm">Loading...</div>
                ) : notifications.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">No notifications</div>
                ) : (
                  notifications.map((n: any) => (
                    <div key={n.id} className={`p-2 border-b last:border-b-0 ${n.read ? 'opacity-60' : ''}`}>
                      <div className="text-sm">{n.payload?.alert ?? 'Alert'}</div>
                      <div className="text-xs text-muted-foreground">{new Date(n.created_at).toLocaleString()}</div>
                      {!n.read && (
                        <div className="mt-1">
                          <button className="text-xs text-blue-500" onClick={() => markRead.mutateAsync(n.id)}>Mark read</button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <Link href="/settings">
          <a className="flex items-center gap-2">
            <UserAvatar />
            <div className="hidden sm:flex flex-col text-sm">
              <span className="font-medium">Account</span>
              <span className="text-xs text-muted-foreground">Manage</span>
            </div>
          </a>
        </Link>
      </div>
    </header>
  )
}
