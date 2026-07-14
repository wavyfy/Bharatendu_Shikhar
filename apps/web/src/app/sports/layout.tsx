import { ReactNode } from "react";
import { SportsTopNav } from "@/components/sports/SportsTopNav";
import { SportsHeader } from "@/components/sports/SportsHeader";

export default function SportsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SportsTopNav />
      <SportsHeader />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
