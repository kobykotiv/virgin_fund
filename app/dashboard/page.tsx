import DashboardShell from "@/components/dashboard"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifySessionToken, COOKIE_NAME } from "@/lib/session"

export const metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  // Server-side: require an authenticated session via our sessions table cookie
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get(COOKIE_NAME)?.value
    const sessionRow = sessionCookie ? await verifySessionToken(sessionCookie) : null
    if (!sessionRow || (sessionRow as any).expired) {
      // Redirect to sign-in page when unauthenticated
      redirect("/auth/signin")
    }
  } catch (e) {
    // On any verification error, redirect to sign-in
    redirect("/auth/signin")
  }

  return (
    <main className="container mx-auto py-8">
      {/* DashboardShell is a client component */}
      <DashboardShell />
    </main>
  )
}
