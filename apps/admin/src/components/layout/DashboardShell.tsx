import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";
import type { UserRole } from "@/features/auth/utils/roles";
import { ToastProvider } from "@/components/ui/Toast";
import { ConfirmProvider } from "@/components/ui/ConfirmDialog";

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
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
          <Topbar displayName={displayName} role={role} />

          <div className="flex flex-1 overflow-hidden">
            <Sidebar role={role} />

            <main className="flex-1 overflow-auto p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </ConfirmProvider>
    </ToastProvider>
  );
}

