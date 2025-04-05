"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  BarChart2,
  DollarSign,
  LayoutDashboard,
  LogOut,
  Menu,
  BotIcon as Robot,
  Settings,
  UserCircle,
  X,
  TrendingUp,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/providers/auth-provider"
import { Badge } from "@/components/ui/badge"
import { UserAvatar } from "@/components/user-avatar"
import { ThemeToggle } from "@/components/theme-toggle"

interface MagazineLayoutProps {
  children: React.ReactNode
}

export function MagazineLayout({ children }: MagazineLayoutProps) {
  const pathname = usePathname()
  const { user, logout, isDemoMode, disableDemoMode } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect for sticky header
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Main navigation items with nested structure
  const mainNavItems = [
    {
      title: "Overview",
      href: "/home",
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
    },
    {
      title: "Bots",
      href: "/bots",
      icon: <Robot className="h-4 w-4 mr-2" />,
    },
    {
      title: "Strategies",
      href: "/strategies",
      icon: <BarChart2 className="h-4 w-4 mr-2" />,
    },
    {
      title: "Performance",
      href: "/performance",
      icon: <TrendingUp className="h-4 w-4 mr-2" />,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: <BarChart2 className="h-4 w-4 mr-2" />,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-4 w-4 mr-2" />,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b transition-all duration-200",
          scrolled ? "bg-background/80 backdrop-blur-lg" : "bg-background",
        )}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/home" className="flex items-center gap-2">
              <Robot className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Virgin Fund : GenEric TraDer AI</span>
            </Link>
            {isDemoMode && (
              <Badge
                variant="outline"
                className="ml-2 bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
              >
                <DollarSign className="h-3 w-3 mr-1" />
                Demo Mode
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                    <UserAvatar user={user} size="sm" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name || user?.email}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {isDemoMode ? "Demo Account ($10M)" : "Paper Trading Account"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  {isDemoMode && (
                    <DropdownMenuItem onClick={disableDemoMode}>
                      <DollarSign className="mr-2 h-4 w-4" />
                      <span>Exit Demo Mode</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <aside className="hidden w-64 border-r p-4 md:block">
          <nav className="flex flex-col space-y-2">
            {mainNavItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  )
}

