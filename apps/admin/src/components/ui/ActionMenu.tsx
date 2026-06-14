"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface ActionMenuItem {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "default" | "danger";
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  customTrigger?: React.ReactNode;
  /** Rendered at the top of the dropdown, above a divider */
  headerSlot?: React.ReactNode;
}

export function ActionMenu({ items, customTrigger, headerSlot }: ActionMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [menuCoords, setMenuCoords] = React.useState({ top: 0, right: 0 });

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
        setMenuCoords({
          top: rect.bottom + window.scrollY + 4,
          right: document.documentElement.clientWidth - rect.right,
        });
      }
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <div onClick={toggle}>
        {customTrigger ? (
          customTrigger
        ) : (
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface focus:outline-none transition-all duration-200 active:scale-95"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        )}
      </div>

      {typeof window !== "undefined" && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.15 }}
              className="fixed z-9999 w-56 origin-top-right rounded-lg border border-outline-variant bg-surface py-1 shadow-xl ring-1 ring-black/5 dark:ring-white/5"
              style={{ top: menuCoords.top, right: menuCoords.right }}
            >
              {/* Header slot — e.g. dark mode toggle */}
              {headerSlot && (
                <>
                  {headerSlot}
                  <div className="my-1 h-px bg-outline-variant" />
                </>
              )}

              {items.map((item, index) => {
                if (item.href && !item.disabled) {
                  return (
                    <Link
                      key={index}
                      href={item.href}
                      className={cn(
                        "group flex items-center px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low transition-colors",
                        item.variant === "danger" && "text-red-600 hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-500"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon && (
                        <span className="mr-3 h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          {item.icon}
                        </span>
                      )}
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <button
                    key={index}
                    type="button"
                    disabled={item.disabled}
                    className={cn(
                      "group flex w-full items-center px-4 py-2 text-left text-sm text-on-surface transition-colors",
                      !item.disabled && "hover:bg-surface-container-low",
                      item.disabled && "cursor-not-allowed opacity-50",
                      item.variant === "danger" && !item.disabled && "text-red-600 hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-500"
                    )}
                    onClick={() => {
                      if (!item.disabled && item.onClick) {
                        item.onClick();
                        setIsOpen(false);
                      }
                    }}
                  >
                    {item.icon && (
                      <span className="mr-3 h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
