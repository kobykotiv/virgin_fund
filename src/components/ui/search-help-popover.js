import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearchMetrics } from '@/lib/hooks/useSearchMetrics';
export function SearchHelpPopover({ className, metrics: externalMetrics }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const internalMetrics = useSearchMetrics();
    // Merge external metrics with internal metrics, providing default values
    const metrics = {
        cacheHits: externalMetrics?.cacheHits ?? internalMetrics.cacheHits ?? 0,
        apiCalls: externalMetrics?.apiCalls ?? internalMetrics.apiCalls ?? 0,
        averageResponseTime: externalMetrics?.averageResponseTime ?? internalMetrics.averageResponseTime ?? 0,
        rateLimitRemaining: externalMetrics?.rateLimitRemaining ?? internalMetrics.rateLimitRemaining ?? 5,
        lastUpdated: externalMetrics?.lastUpdated ?? internalMetrics.lastUpdated ?? new Date(),
    };
    return (_jsxs("div", { className: "relative inline-block", children: [_jsx("button", { type: "button", onMouseEnter: () => setIsOpen(true), onMouseLeave: () => setIsOpen(false), className: cn("p-1 rounded-full text-muted-foreground/50 hover:text-muted-foreground", "transition-colors duration-200", className), "aria-label": "Search help information", children: _jsx(HelpCircle, { className: "w-4 h-4" }) }), isOpen && (_jsx("div", { className: "absolute z-50 w-80 p-4 mt-2 -right-2 rounded-lg glass-card animate-in fade-in-0 zoom-in-95 duration-200", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-medium mb-2", children: "Search Information" }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Cache Hits" }), _jsx("span", { children: metrics.cacheHits })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "API Calls" }), _jsx("span", { children: metrics.apiCalls })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Avg Response Time" }), _jsxs("span", { children: [metrics.averageResponseTime, "ms"] })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium mb-2", children: "Rate Limits" }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Remaining Calls" }), _jsx("span", { children: metrics.rateLimitRemaining })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Reset Time" }), _jsx("span", { children: metrics.lastUpdated.toLocaleTimeString() })] })] })] }), _jsx("div", { className: "text-xs text-muted-foreground/75", children: _jsx("p", { children: "Search is limited to 5 calls per minute. Results are cached for 24 hours." }) })] }) }))] }));
}
