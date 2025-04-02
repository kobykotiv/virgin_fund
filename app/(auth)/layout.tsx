"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isDemoMode } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (user || isDemoMode) {
      router.push("/dashboard")
    }
  }, [user, isDemoMode, router])

  // Allow access to auth pages when not authenticated
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}