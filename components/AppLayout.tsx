import React, { ReactNode } from 'react';
import SidebarNav from './SidebarNav';
import TopBar from './TopBar';
import Footer from './Footer';
import { useUIStore } from '../hooks/useUIStore';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { darkMode } = useUIStore();
  return (
    <div className={`min-h-screen flex flex-col bg-background text-foreground ${darkMode ? 'dark' : ''}`}>
      <TopBar />
      <div className="flex flex-1">
        <SidebarNav />
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AppLayout;
