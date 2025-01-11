import React, { Component, ErrorInfo } from "react";
import { AlertCircle } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Strategy Builder error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-destructive/10 rounded-lg">
          <div className="flex items-center gap-2 text-destructive mb-4">
            <AlertCircle className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Something went wrong</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            An error occurred while loading this step. Please try refreshing the
            page.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
