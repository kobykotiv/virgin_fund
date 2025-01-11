import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthForm } from './components/AuthForm';
import { StrategyBuilder } from './components/StrategyBuilder';
import { Dashboard } from './components/Dashboard';
import { Homepage } from './components/Homepage';
import { Navbar } from './components/Navbar';
import { useAuth } from './hooks/useAuth';
import { StrategyProvider } from './context/StrategyContext';
import { Toaster } from './components/ui/toaster';
import { useThemeStore } from './lib/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return session ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  const { session } = useAuth();
  const { theme } = useThemeStore();

  // Set initial theme
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <StrategyProvider>
          <div className="min-h-screen bg-background text-foreground">
            {session && <Navbar />}
            <div className="container mx-auto py-6">
              <main>
                <Routes>
                  <Route path="/" element={session ? <Navigate to="/dashboard" /> : <Homepage />} />
                  <Route path="/login" element={session ? <Navigate to="/dashboard" /> : <AuthForm type="login" />} />
                  <Route path="/signup" element={session ? <Navigate to="/dashboard" /> : <AuthForm type="signup" />} />
                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/new-strategy"
                    element={
                      <PrivateRoute>
                        <StrategyBuilder />
                      </PrivateRoute>
                    }
                  />
                </Routes>
              </main>
            </div>
          </div>
          <Toaster />
        </StrategyProvider>
      </Router>
    </QueryClientProvider>
  );
}