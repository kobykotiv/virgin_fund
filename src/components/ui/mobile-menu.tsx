// import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, Github, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const menuItems = [
    { label: 'About', href: '#about' },
    { label: 'Features', href: '#features' },
    { label: 'Blog', href: '#blog' },
    { label: 'Documentation', href: '#documentation' },
    { label: 'Pricing', href: '#pricing' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className={cn(
              "fixed right-0 top-0 bottom-0 w-full sm:w-80 z-50",
              "bg-white/10 backdrop-blur-xl border-l border-white/20",
              "flex flex-col"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="space-y-2 px-4">
                {menuItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center justify-between w-full p-3 rounded-lg",
                      "hover:bg-white/10 transition-colors duration-200"
                    )}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </a>
                ))}
              </nav>
            </div>

            {/* Auth Buttons */}
            <div className="p-4 border-t border-white/10 space-y-2">
              <Button asChild className="w-full bg-gradient-to-r from-primary to-purple-600">
                <Link to="/signup" onClick={onClose}>
                  Sign Up
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full glass-button">
                <Link to="/login" onClick={onClose}>
                  Sign In
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="w-full glass-button"
              >
                <a
                  href="https://github.com/yourusername/virgin-fund"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                >
                  <Github className="mr-2 h-5 w-5" />
                  Star on GitHub
                </a>
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}