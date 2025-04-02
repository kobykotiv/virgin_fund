import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"
import Navbar from "@/components/navbar"
import "../styles/globals.css"
import { Providers } from './providers'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Virgin Fund - Automated Trading Platform",
  description: "Professional-grade portfolio management and automated trading platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <header>
              <Navbar />
            </header>
            {children}
            <Toaster />
            <footer className="bg-gray-800 text-white text-center py-8">
              <div className="container mx-auto">
                <div className="mb-4">
                  <h4 className="text-lg font-bold">Subscribe to our Newsletter</h4>
                  <form className="mt-2 flex justify-center">
                    <input 
                      type="email" 
                      placeholder="Your email address" 
                      className="px-4 py-2 rounded-l-md focus:outline-none" 
                    />
                    <button 
                      type="submit" 
                      className="bg-blue-600 px-4 py-2 rounded-r-md hover:bg-blue-700"
                    >
                      Subscribe
                    </button>
                  </form>
                </div>
                <div className="mb-4">
                  <span className="mr-2">Follow us:</span>
                  <a href="https://twitter.com" className="mx-2 hover:text-blue-400">Twitter</a>
                  <a href="https://facebook.com" className="mx-2 hover:text-blue-400">Facebook</a>
                  <a href="https://linkedin.com" className="mx-2 hover:text-blue-400">LinkedIn</a>
                </div>
                {/* New SEO heavy footer links and fee notice */}
                <div className="mb-4">
                  <a href="/terms-of-service" className="mx-2 hover:text-blue-400">Terms of Service</a>
                  <a href="/cloud-terms-of-use" className="mx-2 hover:text-blue-400">Cloud Services Terms &amp; Use</a>
                  <span className="mx-2">Flat $9/month per user</span>
                </div>
                <div className="text-sm">
                  © {new Date().getFullYear()} Virgin Fund. All rights reserved.
                </div>
              </div>
            </footer>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}