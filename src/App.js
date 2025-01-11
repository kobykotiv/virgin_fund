import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
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
function PrivateRoute({ children }) {
    const { session, loading } = useAuth();
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("div", { className: "w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" }) }));
    }
    return session ? _jsx(_Fragment, { children: children }) : _jsx(Navigate, { to: "/login" });
}
export default function App() {
    const { session } = useAuth();
    const { theme } = useThemeStore();
    // Set initial theme
    React.useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);
    return (_jsx(QueryClientProvider, { client: queryClient, children: _jsx(Router, { children: _jsxs(StrategyProvider, { children: [_jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [session && _jsx(Navbar, {}), _jsx("div", { className: "container mx-auto py-6", children: _jsx("main", { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: session ? _jsx(Navigate, { to: "/dashboard" }) : _jsx(Homepage, {}) }), _jsx(Route, { path: "/login", element: session ? _jsx(Navigate, { to: "/dashboard" }) : _jsx(AuthForm, { type: "login" }) }), _jsx(Route, { path: "/signup", element: session ? _jsx(Navigate, { to: "/dashboard" }) : _jsx(AuthForm, { type: "signup" }) }), _jsx(Route, { path: "/dashboard", element: _jsx(PrivateRoute, { children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: "/new-strategy", element: _jsx(PrivateRoute, { children: _jsx(StrategyBuilder, {}) }) })] }) }) })] }), _jsx(Toaster, {})] }) }) }));
}
