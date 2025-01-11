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
export declare function DebugPopover({ error, className }: DebugPopoverProps): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=debug-popover.d.ts.map