import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const router = useRouter();
  
  const navItems = [
    { name: 'Overview', path: '/dashboard' },
    { name: 'Strategies', path: '/dashboard/strategies' },
    { name: 'Bots', path: '/dashboard/bots' },
    { name: 'API Keys', path: '/dashboard/api-keys' },
    { name: 'Portfolio', path: '/dashboard/portfolio' },
    { name: 'Feedback', path: '/dashboard/feedback' },
  ];

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
                <Link href={item.path}>
                  <a className={`flex items-center px-6 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 ${
                    router.pathname === item.path ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
                  }`}>
                    {item.name}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {navItems.find(item => item.path === router.pathname)?.name || 'Dashboard'}
            </h2>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
