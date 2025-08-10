// src/components/DashboardLayout.tsx

import React from "react"
import { SECTIONS, SectionConfig } from "../config/sections"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { LucideIcon, BarChart2, Calculator, PieChart, Activity, Box, TrendingUp, Divide, Columns, Sigma, LayoutDashboard, Signal, Settings, RotateCcw, PiggyBank, Percent, CalendarCheck2, Briefcase, Home, CreditCard } from "lucide-react"
import Link from "next/link"

function getIcon(icon: string): React.ReactElement {
  const icons: Record<string, React.ReactElement> = {
    BarChart2: <BarChart2 size={20} />,
    Calculator: <Calculator size={20} />,
    PieChart: <PieChart size={20} />,
    Activity: <Activity size={20} />,
    Box: <Box size={20} />,
    TrendingUp: <TrendingUp size={20} />,
    Divide: <Divide size={20} />,
    Columns: <Columns size={20} />,
    Sigma: <Sigma size={20} />,
    LayoutDashboard: <LayoutDashboard size={20} />,
    Signal: <Signal size={20} />,
    Settings: <Settings size={20} />,
    RotateCcw: <RotateCcw size={20} />,
    PiggyBank: <PiggyBank size={20} />,
    Percent: <Percent size={20} />,
    CalendarCheck2: <CalendarCheck2 size={20} />,
    Briefcase: <Briefcase size={20} />,
    Home: <Home size={20} />,
    CreditCard: <CreditCard size={20} />,
  }
  return icons[icon] ?? <Calculator size={20} />
}

function SidebarSection({ section }: { section: SectionConfig }) {
  return (
    <div className="mb-2">
      <Link href={section.path} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-muted transition">
        {typeof section.icon === "string" ? getIcon(section.icon) : null}
        <span className="font-medium">{section.label}</span>
      </Link>
      {section.subsections && (
        <div className="ml-6 mt-1 space-y-1">
          {section.subsections.map((sub: SectionConfig) => (
            <SidebarSection key={sub.path} section={sub} />
          ))}
        </div>
      )}
    </div>
  )
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r px-4 py-6 flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-6">
          <BarChart2 size={28} />
          <span className="font-bold text-lg">Dashboard</span>
        </div>
        <nav className="flex-1">
          {SECTIONS.map(section => (
            <SidebarSection key={section.path} section={section} />
          ))}
        </nav>
        <ThemeToggle />
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 border-b flex items-center px-6 bg-card/80 backdrop-blur">
          <span className="font-semibold text-xl">Virgin Fund</span>
          <div className="ml-auto">
            {/* Add user/account controls here */}
          </div>
        </header>
        <div className="flex-1 p-8">{children}</div>
      </main>
    </div>
  )
}
