"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import type { BadgeRow } from "@/features/badges/types";

interface BadgeMultiSelectProps {
  badges: BadgeRow[];
  value: number[];
  onChange: (ids: number[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function BadgeMultiSelect({
  badges,
  value,
  onChange,
  placeholder = "Select badges...",
  disabled = false,
}: BadgeMultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [menuStyle, setMenuStyle] = React.useState({ top: 0, left: 0, width: 0 });

  const selectedBadges = badges.filter((b) => value.includes(b.id));

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

  function toggle(id: number) {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  }

  function remove(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    onChange(value.filter((v) => v !== id));
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm transition-shadow duration-150 text-left",
          isOpen && "ring-2 ring-slate-400 dark:ring-slate-600 ring-offset-2 dark:ring-offset-slate-900",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        {selectedBadges.length === 0 ? (
          <span className="text-slate-400 flex-1">{placeholder}</span>
        ) : (
          <>
            {selectedBadges.map((badge) => (
              <span
                key={badge.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest text-white"
                style={{ backgroundColor: badge.color }}
              >
                {badge.name}
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`Remove ${badge.name}`}
                  onClick={(e) => remove(badge.id, e)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onChange(value.filter((v) => v !== badge.id));
                    }
                  }}
                  className="ml-0.5 cursor-pointer rounded hover:opacity-75 transition-opacity"
                >
                  <X className="w-2.5 h-2.5" />
                </span>
              </span>
            ))}
          </>
        )}
        <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
      </button>

      {typeof window !== "undefined" &&
        createPortal(
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
                {badges.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-outline">
                    No badges available. Create some first.
                  </div>
                ) : (
                  badges.map((badge) => {
                    const selected = value.includes(badge.id);
                    return (
                      <button
                        type="button"
                        key={badge.id}
                        onClick={() => toggle(badge.id)}
                        className={cn(
                          "relative flex w-full cursor-default select-none items-center gap-3 rounded-sm py-2 pl-8 pr-3 text-sm outline-none transition-colors hover:bg-slate-100 dark:hover:bg-slate-700",
                          selected && "bg-surface-container-low font-medium"
                        )}
                      >
                        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                          {selected && <Check className="h-4 w-4 text-on-surface" />}
                        </span>
                        <span
                          className="inline-block w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: badge.color }}
                        />
                        <span className="truncate text-on-surface">{badge.name}</span>
                      </button>
                    );
                  })
                )}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
