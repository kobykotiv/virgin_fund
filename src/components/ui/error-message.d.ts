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
  error:
    | SearchError
    | string
    | {
        details?: string;
      }
    | BaseErrorDetails
    | null;
  className?: string;
}
export declare function ErrorMessage({
  error,
  className,
}: ErrorMessageProps): import("@emotion/react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=error-message.d.ts.map
