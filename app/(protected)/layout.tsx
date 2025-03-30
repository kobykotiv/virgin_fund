'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, loading, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Portfolios', path: '/portfolios' },
    { name: 'Positions', path: '/positions' },
    { name: 'Transactions', path: '/transactions' },
    { name: 'Trades', path: '/trades' },
    { name: 'Rebalances', path: '/rebalances' },
    { name: 'Settings', path: '/settings' },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Virgin Fund</h1>
        </div>
        
        {/* User profile quick access */}
        <div className="px-6 py-2 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user?.name || user?.email}</p>
              <Link href="/profile" className="text-xs text-blue-600 hover:underline">
                View Profile
              </Link>
            </div>
          </div>
        </div>
        
        <nav className="mt-6">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link href={item.path}
                  className={`block px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800 ${
                    pathname === item.path ? 'bg-gray-100 text-gray-800 border-l-4 border-blue-500' : ''
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

