import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export const AssetList = forwardRef(({ selectedAssets, onRemove }, ref) => {
    return (_jsx("div", { ref: ref, className: "flex overflow-x-auto hide-scrollbar gap-2 p-4 min-h-[80px]\n                   bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5\n                   rounded-xl backdrop-blur-lg", children: _jsx(AnimatePresence, { children: selectedAssets.map((symbol) => (_jsx(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.8 }, className: "flex-shrink-0 group", children: _jsxs("div", { className: "flex items-center gap-2 px-4 py-2 rounded-lg\n                            bg-white/10 backdrop-blur-md border border-white/20\n                            shadow-[0_4px_16px_0_rgba(31,38,135,0.2)]\n                            hover:shadow-[0_4px_16px_0_rgba(31,38,135,0.3)]\n                            transition-all duration-300", children: [_jsx("span", { className: "font-medium text-white/90", children: symbol }), _jsx("button", { onClick: () => onRemove(symbol), className: "opacity-0 group-hover:opacity-100 transition-opacity\n                           text-white/50 hover:text-white/90", children: _jsx(X, { className: "w-4 h-4" }) })] }) }, symbol))) }) }));
});
