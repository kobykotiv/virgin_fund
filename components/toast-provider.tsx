import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastType = "success" | "error" | "info";
export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  timeout?: number; // ms
}

interface ToastContextValue {
  toasts: Toast[];
  push: (t: Omit<Toast, "id">) => void;
  remove: (id: string) => void;
}

/**
 * ToastProvider
 *
 * Minimal toast system used across components to show success/error feedback.
 * - Keeps API lightweight: push and remove
 * - Auto-dismisses toasts after `timeout` ms (default 4000)
 * - Uses Tailwind for styling consistent with the repo
 *
 * Usage:
 * const { push } = useToast();
 * push({ type: "success", title: "Saved", message: "Your settings were saved." });
 *
 * Note: This is intentionally simple. Replace with a more feature-rich provider
 * (e.g., react-hot-toast) if you want advanced behavior later.
 */

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const toast: Toast = { id, ...t };
    setToasts((s) => [...s, toast]);

    const timeout = t.timeout ?? 4000;
    if (timeout > 0) {
      setTimeout(() => {
        setToasts((s) => s.filter((x) => x.id !== id));
      }, timeout);
    }
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((s) => s.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(() => ({ toasts, push, remove }), [toasts, push, remove]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast container: bottom-right fixed */}
      <div
        aria-live="polite"
        className="fixed right-4 bottom-4 z-50 flex flex-col gap-2 max-w-sm"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`w-full rounded shadow border p-3 flex flex-col gap-1 ${
              t.type === "success"
                ? "bg-green-50 text-green-800 border-green-200"
                : t.type === "error"
                ? "bg-red-50 text-red-800 border-red-200"
                : "bg-white text-gray-900 border-gray-200 dark:bg-gray-800 dark:text-gray-100"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                {t.title && <div className="font-semibold text-sm">{t.title}</div>}
                <div className="text-sm opacity-90">{t.message}</div>
              </div>
              <button
                onClick={() => remove(t.id)}
                aria-label="Dismiss toast"
                className="text-sm text-gray-500 hover:text-gray-700 ml-2"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
