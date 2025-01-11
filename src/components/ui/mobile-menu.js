import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, Github, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
export function MobileMenu({ isOpen, onClose }) {
    const menuItems = [
        { label: 'About', href: '#about' },
        { label: 'Features', href: '#features' },
        { label: 'Blog', href: '#blog' },
        { label: 'Documentation', href: '#documentation' },
        { label: 'Pricing', href: '#pricing' },
    ];
    return (_jsx(AnimatePresence, { children: isOpen && (_jsxs(_Fragment, { children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-background/80 backdrop-blur-sm z-50", onClick: onClose }), _jsxs(motion.div, { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' }, transition: { type: 'spring', damping: 20 }, className: cn("fixed right-0 top-0 bottom-0 w-full sm:w-80 z-50", "bg-white/10 backdrop-blur-xl border-l border-white/20", "flex flex-col"), children: [_jsxs("div", { className: "flex items-center justify-between p-4 border-b border-white/10", children: [_jsx("h2", { className: "text-lg font-semibold", children: "Menu" }), _jsx(Button, { variant: "ghost", size: "icon", onClick: onClose, className: "rounded-full hover:bg-white/10", children: _jsx(X, { className: "h-5 w-5" }) })] }), _jsx("div", { className: "flex-1 overflow-y-auto py-4", children: _jsx("nav", { className: "space-y-2 px-4", children: menuItems.map((item) => (_jsxs("a", { href: item.href, onClick: onClose, className: cn("flex items-center justify-between w-full p-3 rounded-lg", "hover:bg-white/10 transition-colors duration-200"), children: [_jsx("span", { children: item.label }), _jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })] }, item.href))) }) }), _jsxs("div", { className: "p-4 border-t border-white/10 space-y-2", children: [_jsx(Button, { asChild: true, className: "w-full bg-gradient-to-r from-primary to-purple-600", children: _jsx(Link, { to: "/signup", onClick: onClose, children: "Sign Up" }) }), _jsx(Button, { asChild: true, variant: "outline", className: "w-full glass-button", children: _jsx(Link, { to: "/login", onClick: onClose, children: "Sign In" }) }), _jsx(Button, { asChild: true, variant: "ghost", className: "w-full glass-button", children: _jsxs("a", { href: "https://github.com/yourusername/virgin-fund", target: "_blank", rel: "noopener noreferrer", onClick: onClose, children: [_jsx(Github, { className: "mr-2 h-5 w-5" }), "Star on GitHub"] }) })] })] })] })) }));
}
