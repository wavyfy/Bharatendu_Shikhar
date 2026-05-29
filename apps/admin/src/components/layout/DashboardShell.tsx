import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";
import type { UserRole } from "@/features/auth/utils/roles";
import { ToastProvider } from "@/components/ui/Toast";
import { ConfirmProvider } from "@/components/ui/ConfirmDialog";
import { PageTransition } from "@/components/ui/PageTransition";

interface DashboardShellProps {
  children: React.ReactNode;
  displayName: string;
  role: UserRole;
}

export function DashboardShell({
  children,
  displayName,
  role,
}: DashboardShellProps) {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <div className="h-screen overflow-hidden bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
          <Topbar displayName={displayName} role={role} />

          <div className="flex flex-1 overflow-hidden min-h-0">
            <Sidebar role={role} />

            <main className="flex-1 overflow-auto p-6 lg:p-8 bg-[#F8FAFC] dark:bg-slate-950 min-h-0 min-w-0">
              {children}
            </main>
          </div>
        </div>
      </ConfirmProvider>
    </ToastProvider>
  );
}

