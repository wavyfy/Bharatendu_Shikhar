"use client";

import { createContext, useCallback, useContext, useRef, useState, useMemo } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

// ─── Styles & Icons ─────────────────────────────────────────────────────────

const VARIANT_STYLES: Record<ToastVariant, { container: string; icon: React.ReactNode }> = {
  success: {
    container: "bg-surface border-l-4 border-green-500 text-gray-800",
    icon: <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" strokeWidth={2.5} />,
  },
  error: {
    container: "bg-surface border-l-4 border-red-500 text-gray-800",
    icon: <XCircle className="w-5 h-5 text-red-600 shrink-0" strokeWidth={2.5} />,
  },
  info: {
    container: "bg-surface border-l-4 border-blue-500 text-gray-800",
    icon: <Info className="w-5 h-5 text-blue-600 shrink-0" strokeWidth={2.5} />,
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
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      layout
      className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-md shadow-lg text-sm min-w-[280px] max-w-sm ${container}`}
      role="alert"
    >
      <div className="pt-0.5">{icon}</div>
      <span className="flex-1 leading-relaxed font-medium text-slate-700">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 pt-0.5 ml-2"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" strokeWidth={2.5} />
      </button>
    </motion.div>
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

  const toast = useMemo(() => ({
    success: (m: string) => add(m, "success"),
    error: (m: string) => add(m, "error"),
    info: (m: string) => add(m, "info"),
  }), [add]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Portal-like fixed container */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed top-5 right-5 z-9999 flex flex-col gap-3 items-end pointer-events-none"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
