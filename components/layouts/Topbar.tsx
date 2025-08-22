import React from "react"
import Link from "next/link"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/user-avatar"

export default function Topbar() {
  // Small presentational topbar showing balances, notifications and profile
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
        <Button className="p-2">
          <Bell className="h-5 w-5" />
        </Button>

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
