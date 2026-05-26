import { logoutAction } from "@/features/auth/actions/logout";
import { Badge } from "@/components/ui/Badge";
import type { UserRole } from "@/features/auth/utils/roles";

interface TopbarProps {
  displayName: string;
  role: UserRole;
}

export function Topbar({ displayName, role }: TopbarProps) {
  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center px-4 lg:px-6 justify-between shrink-0 z-20">
      {/* Brand — offset for mobile hamburger (40px) */}
      <span className="font-playfair font-black text-lg text-[#111] pl-10 lg:pl-0">
        Bharatendu Shikhar
      </span>

      {/* Right — user info + logout */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-xs font-semibold text-[#111] leading-tight">
            {displayName}
          </span>
          <Badge variant={role === "admin" ? "accent" : "muted"}>
            {role}
          </Badge>
        </div>

        <div className="w-px h-6 bg-gray-200 hidden sm:block" />

        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#CC2200] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </form>
      </div>
    </header>
  );
}
