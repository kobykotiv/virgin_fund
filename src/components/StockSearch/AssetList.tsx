import React, { forwardRef } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AssetListProps {
  selectedAssets: string[];
  onRemove: (symbol: string) => void;
}

export const AssetList = forwardRef<HTMLDivElement, AssetListProps>(
  ({ selectedAssets, onRemove }, ref) => {
    return (
      <div
        ref={ref}
        className="flex overflow-x-auto hide-scrollbar gap-2 p-4 min-h-[80px]
                   bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5
                   rounded-xl backdrop-blur-lg"
      >
        <AnimatePresence>
          {selectedAssets.map((symbol) => (
            <motion.div
              key={symbol}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex-shrink-0 group"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg
                            bg-white/10 backdrop-blur-md border border-white/20
                            shadow-[0_4px_16px_0_rgba(31,38,135,0.2)]
                            hover:shadow-[0_4px_16px_0_rgba(31,38,135,0.3)]
                            transition-all duration-300">
                <span className="font-medium text-white/90">{symbol}</span>
                <button
                  onClick={() => onRemove(symbol)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity
                           text-white/50 hover:text-white/90"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  }
);