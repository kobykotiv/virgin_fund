import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const router = useRouter();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Portfolios', path: '/portfolios' },
    { name: 'Positions', path: '/positions' },
    { name: 'Trades', path: '/trades' },
    { name: 'Transactions', path: '/transactions' },
    // { name: 'Rebalances', path: '/rebalances' },
    { name: 'Settings', path: '/settings' },
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
                  <a 
                    className={`block px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800 ${
                      router.pathname === item.path ? 'bg-gray-100 text-gray-800 border-l-4 border-blue-500' : ''
                    }`}
                  >
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
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
