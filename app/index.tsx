import React from 'react';
import ReactDOM from 'react-dom/client';
import { Dashboard } from './Dashboard';
import './styles/main.css';
import { errorReporting } from './monitoring/errorReporting';
import { analytics } from './monitoring/analytics';
import { performanceMonitoring } from './monitoring/performance';

// Initialize monitoring services
errorReporting.initialize();
analytics.initialize();
performanceMonitoring.initialize();

// Error boundary for graceful error handling
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean, error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Report error to monitoring service
    errorReporting.captureException(error, {
      component: 'ErrorBoundary',
      additionalData: { errorInfo }
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message || 'An unexpected error occurred'}</p>
          <button onClick={() => window.location.reload()}>Reload Application</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Mount the application
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Track initial page view
analytics.trackPageView({
  path: window.location.pathname,
  title: document.title
});

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Dashboard />
    </ErrorBoundary>
  </React.StrictMode>
);
