import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
import { AlertCircle } from 'lucide-react';
export class ErrorBoundary extends Component {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                hasError: false,
                error: null,
            }
        });
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('Strategy Builder error:', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (_jsxs("div", { className: "p-6 bg-destructive/10 rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-2 text-destructive mb-4", children: [_jsx(AlertCircle, { className: "w-5 h-5" }), _jsx("h2", { className: "text-lg font-semibold", children: "Something went wrong" })] }), _jsx("p", { className: "text-muted-foreground mb-4", children: "An error occurred while loading this step. Please try refreshing the page." }), _jsx("button", { onClick: () => this.setState({ hasError: false, error: null }), className: "px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90", children: "Try Again" })] }));
        }
        return this.props.children;
    }
}
