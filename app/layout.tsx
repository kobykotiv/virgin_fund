import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import ClientLayout from "./ClientLayout"
import '../styles/globals.css'
import { AuthProvider } from '../contexts/auth-context';

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Virgin Fund - Portfolio Management',
  description: 'Track and manage your investment portfolios',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <ClientLayout>{children}</ClientLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}