"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Calculator, PiggyBank, PercentSquare, Banknote, 
  BarChart, LineChart, Calendar, Home, TrendingUp,
  DollarSign, Scale, PieChart, Wallet, Landmark, ArrowRightLeft
} from "lucide-react"

interface DashboardNavProps {
  items: {
    href: string
    title: string
  }[]
}

export function DashboardNav({ items }: DashboardNavProps) {
  const pathname = usePathname()

  // Enhanced calculator items with more detailed organization
  const financialCalculators = [
    { href: "/dashboard/calculators/compound-interest", title: "Compound Interest", icon: <PercentSquare className="mr-2 h-4 w-4" /> },
    { href: "/dashboard/calculators/savings", title: "Savings", icon: <PiggyBank className="mr-2 h-4 w-4" /> },
    { href: "/dashboard/calculators/retirement", title: "Retirement", icon: <Calendar className="mr-2 h-4 w-4" /> },
    { href: "/dashboard/calculators/mortgage", title: "Mortgage", icon: <Home className="mr-2 h-4 w-4" /> },
    { href: "/dashboard/calculators/inflation", title: "Inflation", icon: <TrendingUp className="mr-2 h-4 w-4" /> },
    { href: "/dashboard/calculators/debt", title: "Debt Payoff", icon: <DollarSign className="mr-2 h-4 w-4" /> },
    { href: "/dashboard/calculators/fee-impact", title: "Fee Impact", icon: <BarChart className="mr-2 h-4 w-4" /> },
  ]
  
  const tradingCalculators = [
    { href: "/dashboard/calculators/risk-reward", title: "Risk/Reward", icon: <Scale className="mr-2 h-4 w-4" /> },
    { href: "/dashboard/calculators/position-size", title: "Position Size", icon: <PieChart className="mr-2 h-4 w-4" /> },
    { href: "/dashboard/calculators/leverage", title: "Leverage", icon: <TrendingUp className="mr-2 h-4 w-4" /> },
    { href: "/dashboard/calculators/pivot-points", title: "Pivot Points", icon: <LineChart className="mr-2 h-4 w-4" /> },
    { href: "/dashboard/calculators/spread", title: "Spread", icon: <ArrowRightLeft className="mr-2 h-4 w-4" /> },
    { href: "/dashboard/calculators/options-greeks", title: "Options Greeks", icon: <Calculator className="mr-2 h-4 w-4" /> },
    { href: "/dashboard/calculators/monte-carlo", title: "Monte Carlo", icon: <BarChart className="mr-2 h-4 w-4" /> },
  ]

  const isCalculatorPath = pathname.includes('/calculators/')

  return (
    <nav className="grid items-start gap-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === item.href ? "bg-accent" : "transparent",
          )}
        >
          <span>{item.title}</span>
        </Link>
      ))}

      {/* Financial Calculators Submenu */}
      <div className="pt-2">
        <div className="mb-2 px-3 text-xs font-semibold text-muted-foreground">
          Financial Calculators
        </div>
        <div className={cn("grid grid-cols-1 gap-1")}>
          {financialCalculators.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === item.href ? "bg-accent" : "transparent",
              )}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Trading Calculators Submenu */}
      <div className="pt-2">
        <div className="mb-2 px-3 text-xs font-semibold text-muted-foreground">
          Trading Calculators
        </div>
        <div className={cn("grid grid-cols-1 gap-1")}>
          {tradingCalculators.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === item.href ? "bg-accent" : "transparent",
              )}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

