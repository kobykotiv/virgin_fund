import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@/lib/utils';
export function Advertisement({ className, position = 'sidebar' }) {
    return (_jsx("div", { className: cn("relative overflow-hidden glass-card", position === 'sidebar' && "w-[300px] h-[600px]", position === 'footer' && "w-full h-[90px]", position === 'inline' && "w-full h-[250px]", "flex items-center justify-center", className), children: _jsx("div", { className: "text-center p-4", children: _jsx("p", { className: "text-sm text-muted-foreground", children: "Advertisement" }) }) }));
}
