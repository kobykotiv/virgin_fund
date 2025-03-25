import type React from "react"
import { MainNav } from "@/components/main-nav"
import { Toaster } from "@/components/ui/toaster"
import { redirect } from "next/navigation"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  // In a real app, you would check if the user is authenticated here
  // and redirect to login if not
  const isAuthenticated = true // This would be a real auth check

  if (!isAuthenticated) {
    redirect("/home")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">{children}</main>
      <Toaster />
    </div>
  )
}

