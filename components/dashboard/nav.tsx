"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  BarChart, Settings, Bot, Activity,
  LineChart, Signal, History, PlusCircle
} from "lucide-react"

const items = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: BarChart,
  },
  {
    title: "Bots",
    href: "/dashboard/bots",
    icon: Bot,
  },
  {
    title: "Signals", 
    href: "/dashboard/signals",
    icon: Signal
  },
  {
    title: "Backtest",
    href: "/dashboard/backtest",
    icon: History
  },
  {
    title: "Performance",
    href: "/dashboard/performance", 
    icon: LineChart
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  }
]

export function DashboardNav() {
  const path = usePathname()

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        const Icon = item.icon
        return (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              path === item.href ? "bg-accent" : "transparent",
            )}
          >
            <Icon className="mr-2 h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )
}
