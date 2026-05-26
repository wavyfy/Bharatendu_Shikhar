"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────

type ToastVariant = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
  };
}

// ─── Context ────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx.toast;
}

// ─── Icons ──────────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function XCircleIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  );
}

const VARIANT_STYLES: Record<ToastVariant, { container: string; icon: React.ReactNode }> = {
  success: {
    container: "bg-white border-l-4 border-green-500 text-gray-800",
    icon: <span className="text-green-600"><CheckIcon /></span>,
  },
  error: {
    container: "bg-white border-l-4 border-red-500 text-gray-800",
    icon: <span className="text-red-600"><XCircleIcon /></span>,
  },
  info: {
    container: "bg-white border-l-4 border-blue-500 text-gray-800",
    icon: <span className="text-blue-600"><InfoIcon /></span>,
  },
};

// ─── Single Toast Item ────────────────────────────────────────────────────────

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const { container, icon } = VARIANT_STYLES[toast.variant];
  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-md shadow-md text-sm min-w-[260px] max-w-sm ${container}`}
      role="alert"
    >
      {icon}
      <span className="flex-1 leading-snug">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-gray-400 hover:text-gray-600 transition-colors mt-0.5 shrink-0"
        aria-label="Dismiss"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const dismiss = useCallback((id: string) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback(
    (message: string, variant: ToastVariant) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev.slice(-2), { id, message, variant }]); // max 3 visible
      timers.current[id] = setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  const toast = {
    success: (m: string) => add(m, "success"),
    error: (m: string) => add(m, "error"),
    info: (m: string) => add(m, "info"),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Portal-like fixed container */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 items-end"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
