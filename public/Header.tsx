"use client"

import Link from "next/link"
import { Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Header({ isAuthenticated, auth }) {
  return (
    <header id="main-header" className="border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div id="header-container" className="container flex h-16 items-center justify-between">
        <div id="header-logo" className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">GenEric Trading bot Platform</span>
        </div>
        <nav id="main-nav" className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</Link>
          <Link href="#demos" className="text-sm font-medium hover:text-primary transition-colors">Demos</Link>
          <Link href="#copy-trading" className="text-sm font-medium hover:text-primary transition-colors">Copy Trading</Link>
          <Link href="#remote-bots" className="text-sm font-medium hover:text-primary transition-colors">Remote Bots</Link>
          <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">Testimonials</Link>
          <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</Link>
        </nav>
        <div id="auth-buttons" className="flex items-center gap-4">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Link href="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
              <Button variant="outline" size="sm" onClick={auth.logout}>Log Out</Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">Log In</Button>
              </Link>
              <Link href="/login?tab=signup">
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
