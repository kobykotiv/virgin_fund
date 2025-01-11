import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TrendingUp, BarChart2, Shield, Github, ChevronRight, CreditCard, LineChart, Wallet, Database, Globe2, Cpu, Layers, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { BlobBackground } from './ui/blob-background';
import { MobileMenu } from './ui/mobile-menu';
// import { useMediaQuery } from '@/hooks/useMediaQuery';
const techStack = [
    { name: 'React', icon: _jsx(Layers, { className: "w-5 h-5" }), color: 'text-blue-500' },
    { name: 'TypeScript', icon: _jsx(Cpu, { className: "w-5 h-5" }), color: 'text-blue-600' },
    { name: 'Vite', icon: _jsx(Globe2, { className: "w-5 h-5" }), color: 'text-purple-500' },
    { name: 'Supabase', icon: _jsx(Database, { className: "w-5 h-5" }), color: 'text-green-500' },
    { name: 'TailwindCSS', icon: _jsx(Layers, { className: "w-5 h-5" }), color: 'text-cyan-500' },
    { name: 'Framer Motion', icon: _jsx(Layers, { className: "w-5 h-5" }), color: 'text-pink-500' },
    { name: 'Chart.js', icon: _jsx(LineChart, { className: "w-5 h-5" }), color: 'text-red-500' },
    { name: 'Zustand', icon: _jsx(Layers, { className: "w-5 h-5" }), color: 'text-yellow-500' },
    { name: 'React Query', icon: _jsx(Globe2, { className: "w-5 h-5" }), color: 'text-purple-600' },
    { name: 'React Router', icon: _jsx(Globe2, { className: "w-5 h-5" }), color: 'text-red-600' },
];
export function Homepage() {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    // const isMobile = useMediaQuery('(max-width: 768px)');
    const location = useLocation();
    React.useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);
    return (_jsxs("div", { className: "min-h-screen bg-background relative overflow-hidden", children: [_jsx(BlobBackground, {}), _jsx("header", { className: "sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", children: _jsx("div", { className: "container flex h-14 max-w-screen-2xl items-center", children: _jsxs("div", { className: "flex flex-1 items-center justify-between", children: [_jsxs(Link, { to: "/", className: "flex items-center space-x-2", children: [_jsx(TrendingUp, { className: "h-6 w-6" }), _jsx("span", { className: "font-bold", children: "Virgin Fund" })] }), _jsxs("nav", { className: "hidden md:flex items-center space-x-6", children: [_jsx("a", { href: "#about", className: "text-muted-foreground hover:text-foreground transition-colors", children: "About" }), _jsx("a", { href: "#features", className: "text-muted-foreground hover:text-foreground transition-colors", children: "Features" }), _jsx("a", { href: "#blog", className: "text-muted-foreground hover:text-foreground transition-colors", children: "Blog" }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(Button, { asChild: true, variant: "ghost", children: _jsx(Link, { to: "/login", children: "Sign In" }) }), _jsx(Button, { asChild: true, children: _jsx(Link, { to: "/signup", children: "Get Started" }) })] })] }), _jsx(Button, { variant: "ghost", className: "md:hidden", onClick: () => setMobileMenuOpen(true), children: _jsx(Menu, { className: "h-5 w-5" }) })] }) }) }), _jsx(MobileMenu, { isOpen: mobileMenuOpen, onClose: () => setMobileMenuOpen(false) }), _jsxs("div", { className: "relative w-full overflow-hidden bg-gradient-to-r from-background via-primary/5 to-background py-4 border-y border-border/50", children: [_jsx("div", { className: "flex gap-8 animate-marquee whitespace-nowrap hover:pause", children: [...techStack, ...techStack].map((tech, i) => (_jsxs("div", { className: "flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10", children: [_jsx("span", { className: cn("transition-colors duration-300", tech.color), children: tech.icon }), _jsx("span", { className: "font-medium", children: tech.name })] }, i))) }), _jsx("div", { className: "flex gap-8 animate-marquee whitespace-nowrap absolute top-[1rem] left-[100%]", "aria-hidden": "true" })] }), _jsx("section", { className: "relative pt-16 pb-12 sm:pt-24 sm:pb-20", children: _jsx("div", { className: "container px-4 mx-auto", children: _jsxs("div", { className: "flex flex-col lg:flex-row items-center gap-8 lg:gap-12", children: [_jsxs("div", { className: "flex-1 text-center lg:text-left", children: [_jsxs(motion.h1, { className: "text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: ["Smart Investment", _jsx("br", {}), "Made Simple"] }), _jsx(motion.p, { className: "mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.1 }, children: "Analyze and optimize your Dollar-Cost Averaging strategy with our powerful backtesting tools. Make data-driven investment decisions with confidence." }), _jsxs(motion.div, { className: "mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.2 }, children: [_jsx(Button, { asChild: true, size: "lg", className: "bg-gradient-to-r from-primary to-purple-600", children: _jsxs(Link, { to: "/signup", children: ["Get Started", _jsx(ChevronRight, { className: "ml-2 w-5 h-5" })] }) }), _jsx(Button, { asChild: true, size: "lg", variant: "outline", className: "glass-button", children: _jsxs("a", { href: "https://github.com/yourusername/virgin-fund", target: "_blank", rel: "noopener noreferrer", children: [_jsx(Github, { className: "mr-2 w-5 h-5" }), "Star on GitHub"] }) })] })] }), _jsx(motion.div, { className: "flex-1", initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.5, delay: 0.3 }, children: _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20 blur-3xl" }), _jsx("div", { className: "relative glass-card p-4 rounded-2xl", children: _jsx("img", { src: "https://images.unsplash.com/photo-1642790106117-e829e14a795f", alt: "Investment Dashboard", className: "rounded-lg w-full" }) })] }) })] }) }) }), _jsx("section", { className: "py-12 sm:py-20", children: _jsxs("div", { className: "container px-4 mx-auto", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsx("h2", { className: "text-2xl sm:text-4xl font-bold", children: "Why Choose Virgin Fund?" }), _jsx("p", { className: "mt-4 text-muted-foreground", children: "Advanced tools for smarter investment decisions" })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8", children: features.map((feature, index) => (_jsxs(motion.div, { className: "glass-card p-6 rounded-xl", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: index * 0.1 }, children: [_jsx(feature.icon, { className: "w-12 h-12 text-primary mb-4" }), _jsx("h3", { className: "text-xl font-semibold mb-2", children: feature.title }), _jsx("p", { className: "text-muted-foreground", children: feature.description })] }, feature.title))) })] }) }), _jsx("section", { className: "py-12 sm:py-20", children: _jsx("div", { className: "container px-4 mx-auto", children: _jsxs("div", { className: "glass-card p-8 sm:p-12 rounded-2xl text-center", children: [_jsx("h2", { className: "text-2xl sm:text-4xl font-bold mb-4", children: "Ready to Start Investing Smarter?" }), _jsx("p", { className: "text-muted-foreground mb-8 max-w-2xl mx-auto", children: "Join thousands of investors who are already using Virgin Fund to optimize their investment strategies." }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [_jsx(Button, { asChild: true, size: "lg", className: "bg-gradient-to-r from-primary to-purple-600", children: _jsx(Link, { to: "/signup", children: "Create Free Account" }) }), _jsx(Button, { asChild: true, size: "lg", variant: "outline", children: _jsx(Link, { to: "/login", children: "Sign In" }) })] })] }) }) }), _jsx("footer", { className: "py-8 sm:py-12 border-t border-border", children: _jsxs("div", { className: "container px-4 mx-auto", children: [_jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-8", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(TrendingUp, { className: "w-6 h-6" }), _jsx("span", { className: "font-bold", children: "Virgin Fund" })] }), _jsxs("div", { className: "flex flex-wrap justify-center gap-4 sm:gap-8", children: [_jsx("a", { href: "#", className: "text-muted-foreground hover:text-foreground transition-colors", children: "About" }), _jsx("a", { href: "#", className: "text-muted-foreground hover:text-foreground transition-colors", children: "Blog" }), _jsx("a", { href: "#", className: "text-muted-foreground hover:text-foreground transition-colors", children: "Careers" }), _jsx("a", { href: "#", className: "text-muted-foreground hover:text-foreground transition-colors", children: "Support" })] }), _jsx("div", { className: "flex gap-4", children: _jsx(Button, { variant: "ghost", size: "icon", children: _jsx(Github, { className: "w-5 h-5" }) }) })] }), _jsxs("div", { className: "mt-6 sm:mt-8 text-center text-sm text-muted-foreground", children: ["\u00A9 ", new Date().getFullYear(), " Virgin Fund. All rights reserved."] })] }) })] }));
}
const features = [
    {
        icon: LineChart,
        title: 'Advanced Analytics',
        description: 'Comprehensive analysis of your investment strategy with key performance metrics.'
    },
    {
        icon: CreditCard,
        title: 'Smart Portfolio',
        description: 'Build and manage your investment portfolio with intelligent insights.'
    },
    {
        icon: Shield,
        title: 'Risk Management',
        description: 'Advanced risk assessment tools to protect and optimize your investments.'
    },
    {
        icon: BarChart2,
        title: 'Market Analysis',
        description: 'Real-time market data and trend analysis to inform your decisions.'
    },
    {
        icon: Wallet,
        title: 'Cost Averaging',
        description: 'Optimize your DCA strategy with historical performance analysis.'
    },
    {
        icon: TrendingUp,
        title: 'Performance Tracking',
        description: 'Monitor and analyze your investment performance over time.'
    }
];
