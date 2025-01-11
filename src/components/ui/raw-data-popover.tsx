import React from "react";
import { Code } from "lucide-react";
import { cn } from "@/lib/utils";

interface RawDataPopoverProps {
  data: any;
  title?: string;
  className?: string;
}

export function RawDataPopover({
  data,
  title = "Raw Data",
  className,
}: RawDataPopoverProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className={cn(
          "p-1 rounded-full text-muted-foreground/50 hover:text-muted-foreground",
          "transition-colors duration-200",
          className,
        )}
        aria-label="View raw data"
      >
        <Code className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-96 p-4 mt-2 -right-2 rounded-lg glass-card animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="space-y-2">
            <h3 className="font-medium text-sm">{title}</h3>
            <pre className="text-xs bg-black/20 p-2 rounded overflow-auto max-h-96">
              {JSON.stringify(data || {}, null, 2)}
            </pre>
            <p className="text-xs text-muted-foreground mt-2">
              {data ? Object.keys(data).length : 0} properties found
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
