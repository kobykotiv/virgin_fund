import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Code } from 'lucide-react';
import { cn } from '@/lib/utils';
export function RawDataPopover({ data, title = "Raw Data", className }) {
    const [isOpen, setIsOpen] = React.useState(false);
    return (_jsxs("div", { className: "relative inline-block", children: [_jsx("button", { type: "button", onMouseEnter: () => setIsOpen(true), onMouseLeave: () => setIsOpen(false), className: cn("p-1 rounded-full text-muted-foreground/50 hover:text-muted-foreground", "transition-colors duration-200", className), "aria-label": "View raw data", children: _jsx(Code, { className: "w-4 h-4" }) }), isOpen && (_jsx("div", { className: "absolute z-50 w-96 p-4 mt-2 -right-2 rounded-lg glass-card animate-in fade-in-0 zoom-in-95 duration-200", children: _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "font-medium text-sm", children: title }), _jsx("pre", { className: "text-xs bg-black/20 p-2 rounded overflow-auto max-h-96", children: JSON.stringify(data || {}, null, 2) }), _jsxs("p", { className: "text-xs text-muted-foreground mt-2", children: [data ? Object.keys(data).length : 0, " properties found"] })] }) }))] }));
}
