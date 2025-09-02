"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    async function doLogout() {
      try {
        await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' })
      } finally {
        // Redirect to login regardless of API success
        router.replace('/login')
      }
    }

    doLogout()
  }, [router])

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold">Logging out…</h2>
      <p className="text-sm text-muted-foreground">You will be redirected to the login page shortly.</p>
    </div>
  )
}
