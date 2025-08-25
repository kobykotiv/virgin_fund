import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import NAV from '@/lib/nav'

export default function SideNav() {
  const path = usePathname() || '/'

  return (
    <nav aria-label="Sidebar navigation" className="flex flex-col gap-4">
      {NAV.map((item) => {
        if (item.children) {
          return (
            <div key={item.id}>
              <div className="px-3 text-xs font-medium uppercase text-muted-foreground">{item.label}</div>
              <div className="flex flex-col mt-1 gap-1">
                {item.children.map((c) => (
                  <Link
                    key={c.id}
                    href={c.href || '#'}
                    className={`px-3 py-2 rounded flex items-center gap-3 text-sm hover:bg-primary/10 transition-colors ${
                      path === c.href ? 'bg-primary/20 font-semibold' : ''
                    }`}
                  >
                    {c.icon ? React.createElement(c.icon as any, { className: 'w-4 h-4 opacity-80' }) : null}
                    <span>{c.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )
        }

        return (
          <Link
            key={item.id}
            href={item.href || '#'}
            className={`px-3 py-2 rounded flex items-center gap-3 text-sm hover:bg-primary/10 transition-colors ${
              path === item.href ? 'bg-primary/20 font-semibold' : ''
            }`}
          >
            {item.icon ? React.createElement(item.icon as any, { className: 'w-4 h-4 opacity-80' }) : null}
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { useState, useEffect, useContext } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  BarChart2,
  BookOpen,
  ChevronDown,
  Copy,
  DollarSign,
  Globe,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Newspaper,
  BotIcon as Robot,
  Settings,
  ShoppingCart,
  Star,
  Tag,
  UserCircle,
  Users,
  X,
  Shield,
  Bitcoin,
  TrendingUp,
  Search,
  Upload,
  Activity,
  RefreshCw,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { AuthContext } from "@/providers/auth-provider"
import { Badge } from "@/components/ui/badge"
import { UserAvatar } from "@/components/user-avatar"

export function MainNav() {
  const pathname = usePathname()
  const auth = (useContext(AuthContext) as any) || {}
  const user = auth.user
  const logout = auth.logout
  const isDemoMode = auth.isDemoMode
  const disableDemoMode = auth.disableDemoMode
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Main navigation items with nested structure
  const mainNavItems = [
    {
      title: "Features",
      href: "/#features",
      icon: <Home className="h-4 w-4 mr-2" />,
      children: [
        { title: "Automated Trading", href: "/features/automated-trading", icon: <Robot className="h-4 w-4 mr-2" /> },
        { title: "Copy Trading", href: "/features/copy-trading", icon: <Copy className="h-4 w-4 mr-2" /> },
        { title: "Self-Hosted", href: "/features/self-hosted", icon: <Globe className="h-4 w-4 mr-2" /> },
        { title: "Risk Management", href: "/features/risk-management", icon: <Shield className="h-4 w-4 mr-2" /> },
      ],
    },
    {
      title: "Demos",
      href: "/#demos",
      icon: <BarChart2 className="h-4 w-4 mr-2" />,
      children: [
        { title: "Traditional Markets", href: "/demos/traditional", icon: <DollarSign className="h-4 w-4 mr-2" /> },
        { title: "Cryptocurrency", href: "/demos/crypto", icon: <Bitcoin className="h-4 w-4 mr-2" /> },
        { title: "DeFi Yield", href: "/demos/defi", icon: <TrendingUp className="h-4 w-4 mr-2" /> },
      ],
    },
    {
      title: "Copy Trading",
      href: "/#copy-trading",
      icon: <Copy className="h-4 w-4 mr-2" />,
      children: [
        { title: "Find Traders", href: "/copy-trading/find", icon: <Search className="h-4 w-4 mr-2" /> },
        { title: "Become a Provider", href: "/copy-trading/become-provider", icon: <Users className="h-4 w-4 mr-2" /> },
        { title: "Performance Metrics", href: "/copy-trading/metrics", icon: <BarChart2 className="h-4 w-4 mr-2" /> },
      ],
    },
    {
      title: "Remote Bots",
      href: "/#remote-bots",
      icon: <Robot className="h-4 w-4 mr-2" />,
      children: [
        { title: "Bot Network", href: "/remote-bots/network", icon: <Globe className="h-4 w-4 mr-2" /> },
        { title: "Deployment", href: "/remote-bots/deployment", icon: <Upload className="h-4 w-4 mr-2" /> },
        { title: "Monitoring", href: "/remote-bots/monitoring", icon: <Activity className="h-4 w-4 mr-2" /> },
      ],
    },
    {
      title: "Testimonials",
      href: "/#testimonials",
      icon: <MessageSquare className="h-4 w-4 mr-2" />,
    },
    {
      title: "Pricing",
      href: "/#pricing",
      icon: <Tag className="h-4 w-4 mr-2" />,
    },
    {
      title: "Blog",
      href: "/blog",
      icon: <BookOpen className="h-4 w-4 mr-2" />,
      children: [
        {
          title: "Trading Strategies",
          href: "/blog/category/trading-strategies",
          icon: <BarChart2 className="h-4 w-4 mr-2" />,
        },
        {
          title: "Market Analysis",
          href: "/blog/category/market-analysis",
          icon: <TrendingUp className="h-4 w-4 mr-2" />,
        },
        {
          title: "Platform Updates",
          href: "/blog/category/platform-updates",
          icon: <RefreshCw className="h-4 w-4 mr-2" />,
        },
        { title: "Success Stories", href: "/blog/category/success-stories", icon: <Star className="h-4 w-4 mr-2" /> },
        { title: "All Articles", href: "/blog", icon: <BookOpen className="h-4 w-4 mr-2" /> },
      ],
    },
  ]

  // Dashboard navigation items when logged in
  const dashboardNavItems = [
    {
      href: "/home",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
      active: pathname === "/home",
    },
    {
      href: "/bots",
      label: "Trading Bots",
      icon: <Robot className="h-4 w-4 mr-2" />,
      active: pathname === "/bots",
    },
    {
      href: "/orders",
      label: "Orders",
      icon: <ShoppingCart className="h-4 w-4 mr-2" />,
      active: pathname === "/orders",
    },
    {
      href: "/news",
      label: "News",
      icon: <Newspaper className="h-4 w-4 mr-2" />,
      active: pathname === "/news",
    },
    {
      href: "/backtest",
      label: "Backtest",
      icon: <BarChart2 className="h-4 w-4 mr-2" />,
      active: pathname === "/backtest",
    },
    {
      href: "/profile",
      label: "Profile",
      icon: <UserCircle className="h-4 w-4 mr-2" />,
      active: pathname === "/profile",
    },
    { href: "/pricing", label: "Pricing" },
  ]

  // Determine if we're on the landing page or dashboard
  const isLandingPage =
    pathname === "/" ||
    pathname.startsWith("/blog") ||
    pathname.startsWith("/features") ||
    pathname.startsWith("/demos")
  const navItems = isLandingPage ? mainNavItems : dashboardNavItems

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-200",
        scrolled ? "bg-background/80 backdrop-blur-lg" : "bg-background",
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={user ? "/home" : "/"} className="flex items-center gap-2">
            <Robot className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Virgin Fund : GenEric TraDer AI</span>
          </Link>
          {isDemoMode && (
            <Badge
              className="outline ml-2 bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
            >
              <DollarSign className="h-3 w-3 mr-1" />
              Demo Mode
            </Badge>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="mx-6 hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
          {isLandingPage ? (
            // Landing page navigation with dropdowns
            <>
              {mainNavItems.map((item) => {
                const { title, href, icon, children } = item

                return item.children ? (
                  <DropdownMenu key={title}>
                      <DropdownMenuTrigger asChild>
                      <Button className={`${buttonVariants({ variant: "ghost" })} flex items-center gap-1 h-9 px-2`}>
                        {icon}
                        {title}
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-56">
                      <DropdownMenuLabel>{title}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        {children.map((child) => (
                          <DropdownMenuItem key={child.title} asChild>
                            <Link href={child.href} className="flex items-center cursor-pointer">
                              {child.icon}
                              <span>{child.title}</span>
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    key={title}
                    href={href}
                    className={cn(
                      "flex items-center text-sm font-medium transition-colors hover:text-primary",
                      pathname === href ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {icon}
                    {title}
                  </Link>
                )
              })}
            </>
          ) : (
            // Dashboard navigation
            <>
              {dashboardNavItems.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center text-sm font-medium transition-colors hover:text-primary",
                    route.active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {route.icon}
                  {route.label}
                </Link>
              ))}
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {/* Theme toggle and other controls would go here */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className={`${buttonVariants({ variant: "ghost" })} relative h-8 w-8 rounded-full p-0`}>
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
          ) : (
            <>
              <Link href="/login">
                <Button className={`${buttonVariants({ variant: "outline", size: "sm" })}`}>
                  Log In
                </Button>
              </Link>
              <Link href="/home">
                <Button className={`${buttonVariants({ size: "sm" })}`}>Dashboard</Button>
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <Button
            className={`${buttonVariants({ variant: "ghost", size: "sm" })} md:hidden`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background/95 backdrop-blur-sm md:hidden overflow-y-auto">
          <nav className="flex flex-col p-4 space-y-4">
            {isLandingPage ? (
              // Landing page mobile navigation with accordions
              <>
                {mainNavItems.map((item) => (
                  <div key={item.title} className="border-b pb-4">
                    {item.children ? (
                      <div>
                        <button
                          className="flex items-center justify-between w-full p-2 text-left font-medium"
                          onClick={(e) => {
                            e.preventDefault()
                            const el = document.getElementById(`mobile-${item.title}`)
                            if (el) {
                              el.classList.toggle("hidden")
                            }
                          }}
                        >
                          <span className="flex items-center">
                            {item.icon}
                            {item.title}
                          </span>
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <div id={`mobile-${item.title}`} className="hidden pl-4 mt-2 space-y-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.title}
                              href={child.href}
                              className="flex items-center p-2 text-sm text-muted-foreground hover:text-primary"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {child.icon}
                              {child.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className="flex items-center p-2 font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.icon}
                        {item.title}
                      </Link>
                    )}
                  </div>
                ))}
              </>
            ) : (
              // Dashboard mobile navigation
              <>
                {dashboardNavItems.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "flex items-center text-sm font-medium p-3 rounded-md transition-colors hover:bg-accent",
                      route.active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {route.icon}
                    {route.label}
                  </Link>
                ))}
              </>
            )}

            {user && (
              <>
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center gap-3 p-3">
                    <UserAvatar user={user} size="sm" />
                    <div>
                      <p className="font-medium">{user?.name || user?.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {isDemoMode ? "Demo Account ($10M)" : "Paper Trading Account"}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/profile"
                    className="flex items-center p-3 text-sm text-muted-foreground hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserCircle className="h-4 w-4 mr-2" />
                    Profile
                  </Link>

                  <Link
                    href="/settings"
                    className="flex items-center p-3 text-sm text-muted-foreground hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>

                  {isDemoMode && (
                    <button
                      className="flex items-center p-3 text-sm text-muted-foreground hover:text-primary w-full text-left"
                      onClick={() => {
                        disableDemoMode()
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      Exit Demo Mode
                    </button>
                  )}

                  <button
                    className="flex items-center p-3 text-sm text-muted-foreground hover:text-primary w-full text-left"
                    onClick={() => {
                      logout()
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </button>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

export { Shield, Bitcoin, TrendingUp, Search, Upload, Activity, RefreshCw }
