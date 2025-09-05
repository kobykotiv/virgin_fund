import React from 'react';
import { useUIStore } from '../hooks/useUIStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Home, Bot, PieChart, Play, Calculator, Settings, Users, Store } from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/bots', label: 'Bots', icon: Bot },
  { href: '/portfolio', label: 'Portfolio', icon: PieChart },
  { href: '/backtest', label: 'Backtest', icon: Play },
  { href: '/calculators', label: 'Calculators', icon: Calculator },
  { href: '/strategy-builder', label: 'Strategy Builder', icon: Users },
  { href: '/marketplace', label: 'Marketplace', icon: Store },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const SidebarNav: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useUIStore();

  // Desktop: fixed sidebar
  // Tablet: collapsible sidebar
  // Mobile: slide-in drawer
  return (
    <>
      {/* Hamburger for mobile */}
      <div className="sm:hidden fixed top-4 left-4 z-50">
        <button onClick={toggleSidebar} className="p-2 rounded bg-sidebar text-sidebar-foreground shadow">
          <Menu className="w-6 h-6" />
        </button>
      </div>
      {/* Sidebar for desktop/tablet */}
      <aside className="hidden sm:flex flex-col w-20 lg:w-64 bg-sidebar text-sidebar-foreground shadow-lg">
        <nav className="flex-1 py-4">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-accent transition-colors">
              <Icon className="w-6 h-6" />
              <span className="hidden lg:inline">{label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 w-64 h-full bg-sidebar text-sidebar-foreground shadow-lg z-50 flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <span className="font-bold text-lg">Menu</span>
              <button onClick={toggleSidebar} className="p-2 rounded">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 py-4">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-accent transition-colors" onClick={toggleSidebar}>
                  <Icon className="w-6 h-6" />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default SidebarNav;
