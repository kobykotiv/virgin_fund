"use client"

import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/providers/auth-provider"

// Add error boundary to catch and handle errors
import { ErrorBoundary } from "react-error-boundary"

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="mb-4 text-red-500">{error.message}</p>
      <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md" onClick={resetErrorBoundary}>
        Try again
      </button>
    </div>
  )
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}

