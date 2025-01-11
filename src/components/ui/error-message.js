import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
export function ErrorMessage({ error, className }) {
    const [expanded, setExpanded] = React.useState(false);
    // Type guard to check if error has expected properties
    const hasErrorDetails = (err) => err && (typeof err === 'object') &&
        (err.message !== undefined ||
            err.userMessage !== undefined ||
            err.technical !== undefined);
    // Normalize error to a consistent format
    const errorDetails = typeof error === 'string'
        ? {
            message: error,
            userMessage: error,
            technical: error,
            stage: 'processing',
            origin: 'client',
            timestamp: Date.now(),
            troubleshooting: ['Try again', 'If the problem persists, contact support'],
            referenceCode: `GEN_${Date.now().toString(36)}`
        }
        : error && typeof error === 'object'
            ? 'details' in error
                ? { message: String(error.details), userMessage: String(error.details) }
                : hasErrorDetails(error)
                    ? {
                        message: error.message ? String(error.message) : undefined,
                        userMessage: error.userMessage ? String(error.userMessage) : undefined,
                        technical: error.technical ? String(error.technical) : undefined,
                        stage: error.stage,
                        origin: error.origin,
                        timestamp: error.timestamp,
                        troubleshooting: error.troubleshooting,
                        referenceCode: error.referenceCode
                    }
                    : {
                        message: 'An unknown error occurred',
                        userMessage: 'An unknown error occurred',
                        stage: 'processing',
                        origin: 'client',
                        timestamp: Date.now(),
                        referenceCode: `GEN_${Date.now().toString(36)}`
                    }
            : {
                message: 'An unknown error occurred',
                userMessage: 'An unknown error occurred',
                stage: 'processing',
                origin: 'client',
                timestamp: Date.now(),
                referenceCode: `GEN_${Date.now().toString(36)}`
            };
    // Handle null/undefined error
    if (!errorDetails) {
        return null;
    }
    // Simple error display for non-expandable errors
    if (!errorDetails.troubleshooting?.length && !errorDetails.technical) {
        return (_jsxs("div", { className: cn("flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg", className), children: [_jsx(AlertCircle, { className: "w-4 h-4" }), _jsx("p", { children: errorDetails.userMessage || errorDetails.message || 'An error occurred' })] }));
    }
    return (_jsxs("div", { className: cn("rounded-lg border border-destructive/20 bg-destructive/10", "overflow-hidden transition-all duration-200", className), children: [_jsx("div", { className: "p-4", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-destructive mt-0.5" }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-medium text-destructive", children: errorDetails.userMessage || errorDetails.message || 'An error occurred' }), errorDetails.message && errorDetails.userMessage && errorDetails.message !== errorDetails.userMessage && (_jsx("p", { className: "text-sm text-muted-foreground mt-1", children: errorDetails.message }))] }), _jsx("button", { onClick: () => setExpanded(!expanded), className: "p-1 hover:bg-destructive/10 rounded-full transition-colors", children: expanded ? (_jsx(ChevronDown, { className: "w-4 h-4" })) : (_jsx(ChevronRight, { className: "w-4 h-4" })) })] }) }), expanded && (_jsxs("div", { className: "px-4 pb-4 space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [errorDetails.stage && (_jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground", children: "Stage" }), _jsx("p", { className: "font-medium capitalize", children: errorDetails.stage })] })), errorDetails.origin && (_jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground", children: "Origin" }), _jsx("p", { className: "font-medium capitalize", children: errorDetails.origin })] })), errorDetails.timestamp && (_jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground", children: "Time" }), _jsx("p", { className: "font-medium", children: new Date(errorDetails.timestamp).toLocaleTimeString() })] })), errorDetails.referenceCode && (_jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground", children: "Reference" }), _jsx("p", { className: "font-medium font-mono text-xs", children: errorDetails.referenceCode })] }))] }), errorDetails.troubleshooting && errorDetails.troubleshooting.length > 0 && (_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium mb-2", children: "Troubleshooting Steps:" }), _jsx("ul", { className: "text-sm space-y-1", children: errorDetails.troubleshooting.map((step, index) => (_jsxs("li", { className: "flex items-center gap-2", children: [_jsx("span", { className: "w-4 h-4 rounded-full bg-muted flex items-center justify-center text-xs", children: index + 1 }), step] }, index))) })] })), errorDetails.technical && (_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium mb-2", children: "Technical Details:" }), _jsx("pre", { className: "text-xs bg-muted/50 p-2 rounded overflow-x-auto", children: errorDetails.technical })] }))] }))] }));
}
