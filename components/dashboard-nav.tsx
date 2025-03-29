"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Bot,
  BarChart2,
  Settings,
  Home,
  Grid,
  History,
  Signal,
  GitBranch,
  BadgeDollarSign,
  ArrowLeftRight,
} from "lucide-react"

const menuItems = [
  { title: "Overview", href: "/home", icon: Home },
  { title: "Trading Bots", href: "/bots", icon: Bot },
  { title: "Strategies", href: "/strategies", icon: GitBranch },
  { title: "Grid Trading", href: "/grid", icon: Grid },
  { title: "Portfolio", href: "/portfolio", icon: BarChart2 },
  { title: "Trade History", href: "/history", icon: History },
  { title: "Market Signals", href: "/signals", icon: Signal },
  { title: "Paper Trading", href: "/paper", icon: BadgeDollarSign },
  { title: "Copy Trading", href: "/copy", icon: ArrowLeftRight },
  { title: "Settings", href: "/settings", icon: Settings },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <div className="group/sidebar flex flex-col gap-4 py-2 data-[collapsed=true]:py-2 w-60 border-r">
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          return (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent",
                pathname === item.href ? "bg-accent" : "transparent"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

