import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
export function DebugPopover({ error, className }) {
    const [isOpen, setIsOpen] = React.useState(false);
    // Early return if no error details
    if (!error)
        return null;
    // Handle different error message formats
    const errorMessage = typeof error === 'string' ? error : error.message;
    return (_jsxs("div", { className: "relative inline-block", children: [_jsxs("div", { onMouseEnter: () => setIsOpen(true), onMouseLeave: () => setIsOpen(false), className: cn("inline-flex items-center gap-2 text-red-400 cursor-help", className), children: [_jsx(AlertCircle, { className: "w-4 h-4" }), _jsx("span", { children: errorMessage })] }), isOpen && (_jsxs("div", { className: "absolute z-50 w-96 p-4 mt-2 rounded-lg glass-card", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h3", { className: "font-medium", children: "Debug Information" }), _jsx("button", { onClick: () => setIsOpen(false), className: "p-1 rounded-full hover:bg-white/10", children: _jsx(X, { className: "w-4 h-4" }) })] }), _jsxs("div", { className: "space-y-3 text-sm", children: [_jsxs("div", { children: [_jsx("div", { className: "text-muted-foreground mb-1", children: "Timestamp" }), _jsx("div", { children: new Date(error.timestamp || Date.now()).toLocaleString() })] }), error.request && (_jsxs("div", { children: [_jsx("div", { className: "text-muted-foreground mb-1", children: "Request" }), _jsx("pre", { className: "bg-black/20 p-2 rounded overflow-auto", children: JSON.stringify(error.request, null, 2) })] })), error.response && (_jsxs("div", { children: [_jsx("div", { className: "text-muted-foreground mb-1", children: "Response" }), _jsx("pre", { className: "bg-black/20 p-2 rounded overflow-auto", children: JSON.stringify(error.response, null, 2) })] }))] })] }))] }));
}
