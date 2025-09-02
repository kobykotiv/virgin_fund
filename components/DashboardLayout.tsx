import React, { useEffect } from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import { useAuth } from '@/providers/auth-provider';

// Lazy require runAuthLifecycle to avoid SSR import issues
const { runAuthLifecycle } = require('@/hooks/useAuthLifecycle') as any

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const auth = useAuth()

  useEffect(() => {
    if (auth.isAuthenticated) {
      // best-effort refresh of server-derived auth state (keys, metadata)
      runAuthLifecycle().catch(() => null)
    }
  }, [auth.isAuthenticated])
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 px-6 flex items-center border-b bg-background/80 backdrop-blur-xl">
          <div className="text-xl font-semibold">Dashboard</div>
        </header>
        <section className="flex-1 p-6">{children}</section>
      </main>
    </div>
  );
}
