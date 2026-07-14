import { ReactNode } from "react";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { SportsNav } from "./SportsNav";

export const metadata = { title: "Sports | Bharatendu Shikhar Admin" };

export default function SportsLayout({ children }: { children: ReactNode }) {
  return (
    <AnimatedPage className="space-y-6">
      <div>
        <h1 className="page-title">Sports</h1>
        <p className="page-subtitle">Manage competitions, matches, and teams.</p>
      </div>
      
      <div className="space-y-6">
        <SportsNav />
        <div className="min-w-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {children}
        </div>
      </div>
    </AnimatedPage>
  );
}
