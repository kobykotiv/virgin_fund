import type React from "react"
import { MagazineLayout } from "@/components/dashboard/magazine-layout"
import { redirect } from "next/navigation"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  // In a real app, you would check if the user is authenticated here
  // and redirect to login if not
  const isAuthenticated = true // This would be a real auth check

  if (!isAuthenticated) {
    redirect("/home")
  }

  return <MagazineLayout>{children}</MagazineLayout>
}

