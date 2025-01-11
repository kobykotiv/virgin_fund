import React from "react";
import { AlertCircle, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SearchError } from "@/lib/errors/searchErrors";

interface BaseErrorDetails {
  message?: string;
  userMessage?: string;
  technical?: string;
  stage?: "processing" | string;
  origin?: "client" | string;
  timestamp?: number;
  troubleshooting?: string[];
  referenceCode?: string;
}

interface ErrorMessageProps {
  error: SearchError | string | { details?: string } | BaseErrorDetails | null;
  className?: string;
}

export function ErrorMessage({ error, className }: ErrorMessageProps) {
  const [expanded, setExpanded] = React.useState(false);

  // Type guard to check if error has expected properties
  const hasErrorDetails = (err: any): err is BaseErrorDetails =>
    err &&
    typeof err === "object" &&
    (err.message !== undefined ||
      err.userMessage !== undefined ||
      err.technical !== undefined);

  // Normalize error to a consistent format
  const errorDetails: BaseErrorDetails =
    typeof error === "string"
      ? {
          message: error,
          userMessage: error,
          technical: error,
          stage: "processing",
          origin: "client",
          timestamp: Date.now(),
          troubleshooting: [
            "Try again",
            "If the problem persists, contact support",
          ],
          referenceCode: `GEN_${Date.now().toString(36)}`,
        }
      : error && typeof error === "object"
        ? "details" in error
          ? {
              message: String(error.details),
              userMessage: String(error.details),
            }
          : hasErrorDetails(error)
            ? {
                message: error.message ? String(error.message) : undefined,
                userMessage: error.userMessage
                  ? String(error.userMessage)
                  : undefined,
                technical: error.technical
                  ? String(error.technical)
                  : undefined,
                stage: error.stage,
                origin: error.origin,
                timestamp: error.timestamp,
                troubleshooting: error.troubleshooting,
                referenceCode: error.referenceCode,
              }
            : {
                message: "An unknown error occurred",
                userMessage: "An unknown error occurred",
                stage: "processing",
                origin: "client",
                timestamp: Date.now(),
                referenceCode: `GEN_${Date.now().toString(36)}`,
              }
        : {
            message: "An unknown error occurred",
            userMessage: "An unknown error occurred",
            stage: "processing",
            origin: "client",
            timestamp: Date.now(),
            referenceCode: `GEN_${Date.now().toString(36)}`,
          };

  // Handle null/undefined error
  if (!errorDetails) {
    return null;
  }

  // Simple error display for non-expandable errors
  if (!errorDetails.troubleshooting?.length && !errorDetails.technical) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg",
          className,
        )}
      >
        <AlertCircle className="w-4 h-4" />
        <p>
          {errorDetails.userMessage ||
            errorDetails.message ||
            "An error occurred"}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-destructive/20 bg-destructive/10",
        "overflow-hidden transition-all duration-200",
        className,
      )}
    >
      {/* Error Header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-destructive">
              {errorDetails.userMessage ||
                errorDetails.message ||
                "An error occurred"}
            </h3>
            {errorDetails.message &&
              errorDetails.userMessage &&
              errorDetails.message !== errorDetails.userMessage && (
                <p className="text-sm text-muted-foreground mt-1">
                  {errorDetails.message}
                </p>
              )}
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 hover:bg-destructive/10 rounded-full transition-colors"
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Error Context */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {errorDetails.stage && (
              <div>
                <p className="text-muted-foreground">Stage</p>
                <p className="font-medium capitalize">{errorDetails.stage}</p>
              </div>
            )}
            {errorDetails.origin && (
              <div>
                <p className="text-muted-foreground">Origin</p>
                <p className="font-medium capitalize">{errorDetails.origin}</p>
              </div>
            )}
            {errorDetails.timestamp && (
              <div>
                <p className="text-muted-foreground">Time</p>
                <p className="font-medium">
                  {new Date(errorDetails.timestamp).toLocaleTimeString()}
                </p>
              </div>
            )}
            {errorDetails.referenceCode && (
              <div>
                <p className="text-muted-foreground">Reference</p>
                <p className="font-medium font-mono text-xs">
                  {errorDetails.referenceCode}
                </p>
              </div>
            )}
          </div>

          {/* Troubleshooting Steps */}
          {errorDetails.troubleshooting &&
            errorDetails.troubleshooting.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">
                  Troubleshooting Steps:
                </p>
                <ul className="text-sm space-y-1">
                  {errorDetails.troubleshooting.map(
                    (step: string, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-muted flex items-center justify-center text-xs">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}

          {/* Technical Details */}
          {errorDetails.technical && (
            <div>
              <p className="text-sm font-medium mb-2">Technical Details:</p>
              <pre className="text-xs bg-muted/50 p-2 rounded overflow-x-auto">
                {errorDetails.technical}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
