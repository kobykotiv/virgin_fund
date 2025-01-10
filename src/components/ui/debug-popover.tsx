import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorDetails {
  message: string;
  timestamp: number;
  request?: {
    url?: string;
    method?: string;
    params?: Record<string, any>;
  };
  response?: any;
}

interface DebugPopoverProps {
  error?: ErrorDetails;
  className?: string;
}

export function DebugPopover({ error, className }: DebugPopoverProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Early return if no error details
  if (!error) return null;

  // Handle different error message formats
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className={cn(
          "inline-flex items-center gap-2 text-red-400 cursor-help",
          className
        )}
      >
        <AlertCircle className="w-4 h-4" />
        <span>{errorMessage}</span>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-96 p-4 mt-2 rounded-lg glass-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Debug Information</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <div className="text-muted-foreground mb-1">Timestamp</div>
              <div>{new Date(error.timestamp || Date.now()).toLocaleString()}</div>
            </div>

            {error.request && (
              <div>
                <div className="text-muted-foreground mb-1">Request</div>
                <pre className="bg-black/20 p-2 rounded overflow-auto">
                  {JSON.stringify(error.request, null, 2)}
                </pre>
              </div>
            )}

            {error.response && (
              <div>
                <div className="text-muted-foreground mb-1">Response</div>
                <pre className="bg-black/20 p-2 rounded overflow-auto">
                  {JSON.stringify(error.response, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}