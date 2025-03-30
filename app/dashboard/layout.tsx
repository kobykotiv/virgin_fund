'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/auth-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Portfolios', path: '/portfolios' },
    { name: 'Positions', path: '/positions' },
    { name: 'Transactions', path: '/transactions' },
    { name: 'Trades', path: '/trades' },
    { name: 'Rebalances', path: '/rebalances' },
    { name: 'Settings', path: '/settings' },
  ];

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Virgin Fund</h1>
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
  );
}

