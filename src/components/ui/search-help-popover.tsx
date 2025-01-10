import React from 'react';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearchMetrics } from '@/lib/hooks/useSearchMetrics';

interface SearchHelpPopoverProps {
  className?: string;
}

export function SearchHelpPopover({ className }: SearchHelpPopoverProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const metrics = useSearchMetrics();

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className={cn(
          "p-1 rounded-full text-muted-foreground/50 hover:text-muted-foreground",
          "transition-colors duration-200",
          className
        )}
        aria-label="Search help information"
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-80 p-4 mt-2 -right-2 rounded-lg glass-card animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Search Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cache Hits</span>
                  <span>{metrics.cacheHits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">API Calls</span>
                  <span>{metrics.apiCalls}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Response Time</span>
                  <span>{metrics.averageResponseTime}ms</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Rate Limits</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Remaining Calls</span>
                  <span>{metrics.rateLimitRemaining}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reset Time</span>
                  <span>{metrics.lastUpdated.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground/75">
              <p>Search is limited to 5 calls per minute. Results are cached for 24 hours.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}