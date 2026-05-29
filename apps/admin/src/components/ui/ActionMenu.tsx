"use client";

import * as React from "react";
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
}

export function ActionMenu({ items, customTrigger }: ActionMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {customTrigger ? (
          customTrigger
        ) : (
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-colors duration-150"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-1 w-48 origin-top-right rounded-md border border-slate-200 bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
          >
            {items.map((item, index) => {
              if (item.href && !item.disabled) {
                return (
                  <Link
                    key={index}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors",
                      item.variant === "danger" && "text-red-600 hover:bg-red-50 hover:text-red-700"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon && (
                      <span className="mr-3 h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity">
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
                    "group flex w-full items-center px-4 py-2 text-left text-sm text-slate-700 transition-colors",
                    !item.disabled && "hover:bg-slate-100 hover:text-slate-900",
                    item.disabled && "cursor-not-allowed opacity-50",
                    item.variant === "danger" && !item.disabled && "text-red-600 hover:bg-red-50 hover:text-red-700"
                  )}
                  onClick={() => {
                    if (!item.disabled && item.onClick) {
                      item.onClick();
                      setIsOpen(false);
                    }
                  }}
                >
                  {item.icon && (
                    <span className="mr-3 h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity">
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
