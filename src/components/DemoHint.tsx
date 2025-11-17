import { useState } from "react";
import { X, Info } from "lucide-react";

export function DemoHint() {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-96 bg-card border border-primary/30 rounded-lg shadow-lg glass-card p-4 z-40 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <Info className="w-5 h-5 text-primary mt-0.5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">Try Demo Account</h3>
          <p className="text-sm text-muted-foreground mb-3">
            <span className="font-medium">Email:</span> nimda@demo.app
            <br />
            <span className="font-medium">Password:</span> adminadmin
          </p>
          <p className="text-xs text-muted-foreground italic">
            Explore the append-only notes feature and full app functionality with this demo account.
          </p>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Dismiss hint"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
