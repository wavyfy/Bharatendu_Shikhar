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
  logoUrl?: string | null;
  darkLogoUrl?: string | null;
}

export function DashboardShell({
  children,
  displayName,
  role,
  logoUrl,
  darkLogoUrl,
}: DashboardShellProps) {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <div className="h-screen overflow-hidden bg-surface text-on-surface flex flex-col">
          <Topbar displayName={displayName} role={role} logoUrl={logoUrl} darkLogoUrl={darkLogoUrl} />

          <div className="flex flex-1 overflow-hidden min-h-0">
            <Sidebar role={role} />

            <main className="flex-1 overflow-auto bg-surface min-h-0 min-w-0">
              <PageTransition>
                <div className="p-3 sm:p-6 lg:p-8 max-w-[1440px] mx-auto w-full">
                  {children}
                </div>
              </PageTransition>
            </main>
          </div>
        </div>
      </ConfirmProvider>
    </ToastProvider>
  );
}
