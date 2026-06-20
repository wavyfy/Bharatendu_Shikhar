"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { Button } from "./Button";

// ─── Types ─────────────────────────────────────────────────────────────────

interface ConfirmOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

type ResolveRef = (value: boolean) => void;

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

// ─── Context ────────────────────────────────────────────────────────────────

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within <ConfirmProvider>");
  return ctx.confirm;
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [dialog, setDialog] = useState<(ConfirmOptions & { id: string }) | null>(null);
  const resolveRef = useRef<ResolveRef | null>(null);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setDialog({ ...options, id: crypto.randomUUID() });
    });
  }, []);

  function handleResult(value: boolean) {
    resolveRef.current?.(value);
    resolveRef.current = null;
    setDialog(null);
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {dialog && (
        // Overlay
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => handleResult(false)}
          />
          {/* Dialog box */}
          <div className="relative bg-surface rounded-lg shadow-xl w-full max-w-sm p-6 space-y-4">
            <div className="space-y-1.5">
              <h2 id="confirm-title" className="text-base font-semibold text-on-surface">
                {dialog.title}
              </h2>
              {dialog.description && (
                <p className="text-sm text-on-surface-variant">{dialog.description}</p>
              )}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => handleResult(false)}
              >
                {dialog.cancelLabel ?? "Cancel"}
              </Button>
              <Button
                variant="primary"
                className={dialog.destructive !== false ? "bg-red-600 hover:bg-red-700" : ""}
                onClick={() => handleResult(true)}
              >
                {dialog.confirmLabel ?? "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
