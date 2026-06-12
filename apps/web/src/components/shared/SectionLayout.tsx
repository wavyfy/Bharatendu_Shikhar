import { ReactNode } from "react";

export function SectionLayout({
  leftContent,
  rightContent,
}: {
  leftContent: ReactNode;
  rightContent: ReactNode;
}) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-10 min-w-0 w-full">
      {/* Left Column (8 cols) */}
      <div className="md:col-span-8 pr-4">
        {leftContent}
      </div>
      
      {/* Right Column (4 cols) */}
      <div className="md:col-span-4 pl-4 md:border-l-2 border-gray-300">
        {rightContent}
      </div>
    </section>
  );
}
