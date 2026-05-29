"use client";

import { logoutAction } from "@/features/auth/actions/logout";
import { ActionMenu } from "@/components/ui/ActionMenu";
import type { UserRole } from "@/features/auth/utils/roles";
import { LogOut, User as UserIcon } from "lucide-react";

interface TopbarProps {
  displayName: string;
  role: UserRole;
}

export function Topbar({ displayName, role }: TopbarProps) {
  return (
    <header className="h-14 sticky top-0 bg-white border-b border-slate-200 flex items-center px-4 lg:px-6 justify-between shrink-0 z-30">
      {/* Brand — offset for mobile hamburger (40px) */}
      <span className="font-sans font-bold tracking-tight text-lg text-slate-900 pl-10 lg:pl-0">
        Bharatendu Shikhar
      </span>

      {/* Right — user info + dropdown */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-semibold text-slate-900 leading-tight">
              {displayName}
            </span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
              {role}
            </span>
          </div>
          
          {/* Avatar Area with Dropdown */}
          <ActionMenu 
            items={[
              {
                label: "Profile Settings",
                icon: <UserIcon className="w-4 h-4" strokeWidth={1.5} />,
                href: "/settings"
              },
              {
                label: "Sign out",
                icon: <LogOut className="w-4 h-4" strokeWidth={1.5} />,
                variant: "danger",
                onClick: () => {
                  // We need to trigger the form action
                  const form = document.getElementById('logout-form') as HTMLFormElement;
                  if (form) form.requestSubmit();
                }
              }
            ]}
            customTrigger={
              <button
                type="button"
                className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-colors border border-slate-200 shadow-sm"
              >
                <span className="text-sm font-semibold">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </button>
            }
          />
          <form id="logout-form" action={logoutAction} className="hidden" />
        </div>
      </div>
    </header>
  );
}
