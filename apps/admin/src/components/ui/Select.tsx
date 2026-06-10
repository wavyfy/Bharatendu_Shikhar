"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className,
  disabled = false,
  error,
}: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [menuStyle, setMenuStyle] = React.useState({ top: 0, left: 0, width: 0 });

  const selectedOption = options.find((opt) => opt.value === value);

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMenuStyle({
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  const toggle = () => {
    if (!disabled) setIsOpen(!isOpen);
  };

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={toggle}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface transition-shadow duration-150",
          isOpen && "ring-2 ring-slate-400 dark:ring-slate-600 ring-offset-2 dark:ring-offset-slate-900",
          !isOpen && "focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 focus:ring-offset-2 dark:focus:ring-offset-slate-900",
          disabled && "cursor-not-allowed opacity-50",
          error && "border-red-500 focus:ring-red-400 text-red-900 dark:text-red-400 ring-red-400 ring-offset-2 dark:ring-offset-slate-900"
        )}
      >
        <span className={cn("truncate", !selectedOption && "text-slate-400", error && "text-red-900")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 opacity-50", error && "text-red-900")} />
      </button>

      {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}

      {typeof window !== "undefined" && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              style={{
                position: "absolute",
                top: menuStyle.top,
                left: menuStyle.left,
                width: menuStyle.width,
              }}
              className="z-9999 max-h-60 overflow-auto rounded-md border border-outline-variant bg-surface py-1 shadow-lg"
            >
              {options.length === 0 ? (
                <div className="px-3 py-2 text-sm text-outline">
                  No options found
                </div>
              ) : (
                options.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    className={cn(
                      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100",
                      option.value === value && "bg-surface-container-low font-medium text-on-surface"
                    )}
                    onClick={() => {
                      onChange?.(option.value);
                      setIsOpen(false);
                    }}
                  >
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      {option.value === value && <Check className="h-4 w-4" />}
                    </span>
                    <span className="truncate">{option.label}</span>
                  </button>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
