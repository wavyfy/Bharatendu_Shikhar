"use client";

import { logoutAction } from "@/features/auth/actions/logout";
import { ActionMenu } from "@/components/ui/ActionMenu";
import type { UserRole } from "@/features/auth/utils/roles";
import { LogOut, Settings as SettingsIcon } from "lucide-react";
import { DarkModeToggleItem } from "@/components/ui/DarkModeToggleItem";

interface TopbarProps {
  displayName: string;
  role: UserRole;
}

export function Topbar({ displayName, role }: TopbarProps) {
  return (
    <header className="h-16 sticky top-0 bg-surface/80 backdrop-blur-md border-b border-outline-variant flex items-center px-6 justify-between shrink-0 z-30 shadow-sm">
      {/* Brand title — left side, offset for mobile hamburger */}
      <div className="pl-10 lg:pl-0">
        <div
          className="font-bold text-primary leading-tight"
          style={{ fontFamily: "Plus Jakarta Sans, system-ui, sans-serif", fontSize: "17px", letterSpacing: "-0.01em" }}
        >
          Bharatendu Shikhar
        </div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
          CMS Portal
        </div>
      </div>

      {/* Right — user info + dropdown only */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-semibold text-on-surface leading-tight">{displayName}</span>
          <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wide">{role}</span>
        </div>

        <ActionMenu
          headerSlot={<DarkModeToggleItem />}
          items={[
            {
              label: "Settings",
              icon: <SettingsIcon className="w-4 h-4" strokeWidth={1.5} />,
              href: "/settings",
            },
            {
              label: "Sign out",
              icon: <LogOut className="w-4 h-4" strokeWidth={1.5} />,
              variant: "danger",
              onClick: () => {
                const form = document.getElementById("logout-form") as HTMLFormElement;
                if (form) form.requestSubmit();
              },
            },
          ]}
          customTrigger={
            <button
              type="button"
              className="w-9 h-9 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center text-primary font-bold text-sm hover:bg-surface-container-high hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors shadow-sm"
            >
              {displayName.charAt(0).toUpperCase()}
            </button>
          }
        />
        <form id="logout-form" action={logoutAction} className="hidden" />
      </div>
    </header>
  );
}
