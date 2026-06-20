"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UserRole } from "@/features/auth/utils/roles";
import { hasPermission } from "@/features/auth/utils/roles";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/",
    section: "dashboard",
    icon: "dashboard",
  },
  {
    label: "Articles",
    href: "/articles",
    section: "articles",
    icon: "description",
  },
  {
    label: "Categories",
    href: "/categories",
    section: "categories",
    icon: "category",
  },
  {
    label: "Regions",
    href: "/regions",
    section: "regions",
    icon: "public",
  },
  {
    label: "Badges",
    href: "/badges",
    section: "badges",
    icon: "label",
  },
  {
    label: "Publishers",
    href: "/publishers",
    section: "publishers",
    icon: "business",
  },
  {
    label: "E-Papers",
    href: "/epapers",
    section: "epapers",
    icon: "newspaper",
  },
  {
    label: "Advertisements",
    href: "/advertisements",
    section: "advertisements",
    icon: "ads_click",
  },
  {
    label: "Settings",
    href: "/settings",
    section: "settings",
    icon: "settings",
  },
] as const;

interface SidebarProps {
  role: UserRole;
}

export function Sidebar({ role }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const allowed = NAV_ITEMS.filter(({ section }) =>
    hasPermission(role, section)
  );

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const navContent = (
    <div className="flex flex-col flex-1 min-h-0">

      {/* Nav items */}
      <nav className="flex-1 flex flex-col gap-1">
        {allowed.map(({ label, href, section, icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={section}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 active:scale-[0.98] ${
                active
                  ? "bg-surface-container-high text-primary font-bold border-r-2 border-primary"
                  : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[20px] w-6 flex items-center justify-center shrink-0 transition-transform duration-200 ${!active && "group-hover:scale-110 group-hover:rotate-3"}`}
                style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {icon}
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

        {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-surface-variant flex flex-col gap-2">
        <Link
          href="/articles/new"
          onClick={() => setMobileOpen(false)}
          className="btn-cms-primary justify-center group active:scale-[0.98] transition-all "
        >
          <span className="material-symbols-outlined text-[18px] w-5 flex items-center justify-center shrink-0 transition-transform group-hover:-translate-y-1">add</span>
          New Article
        </Link>
        <Link
          href="/epapers/new"
          onClick={() => setMobileOpen(false)}
          className="btn-cms-secondary justify-center group active:scale-[0.98] transition-all"
        >
          <span className="material-symbols-outlined text-[18px] w-5 flex items-center justify-center shrink-0 transition-transform group-hover:-translate-y-1">upload_file</span>
          Upload E-Paper
        </Link>
      </div>
      
      </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-3.5 left-4 z-50 p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-all duration-200 active:scale-95"
        aria-label="Toggle menu"
      >
        {mobileOpen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden flex flex-col fixed top-0 left-0 z-40 h-full w-64 bg-surface border-r border-outline-variant py-6 px-4 pt-14 overflow-y-auto transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-surface border-r border-outline-variant h-full overflow-y-auto py-6 px-4 gap-0">
        {navContent}
      </aside>
    </>
  );
}
