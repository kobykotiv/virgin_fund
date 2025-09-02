import './globals.css';
import type { Metadata } from 'next';
import { ReactQueryProvider } from '@/components/ReactQueryProvider';

export const metadata: Metadata = {
  title: 'Trading Agent Dashboard',
  description: 'Advanced trading agent dashboard with real-time analytics and portfolio management',
  keywords: ['trading', 'analytics', 'portfolio', 'dashboard', 'finance'],
  authors: [{ name: 'Virgin Fund Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

/**
 * Root layout for Trading Agent Dashboard
 * Provides global styles, providers, and navigation structure
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ReactQueryProvider>
          <div className="min-h-screen bg-background">
            {/* Navigation will be added by individual pages */}
            <main className="relative">
              {children}
            </main>
          </div>
        </ReactQueryProvider>
      </body>
    </html>
  );
}