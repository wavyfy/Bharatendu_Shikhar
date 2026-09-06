"use client";

import { useRef, useState, useEffect } from "react";

interface StatItem {
  label: string;
  value: string | number;
  icon: string;
  cardBg: string;
  iconBg: string;
}

export function DashboardStats({ stats }: { stats: StatItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeft(scrollLeft > 0);
    setShowRight(Math.ceil(scrollLeft) < scrollWidth - clientWidth - 2);
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, []);

  const scrollBy = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="grid grid-rows-2 grid-flow-col auto-cols-[42.5vw] sm:auto-cols-[200px] md:grid-rows-none md:grid-flow-row md:auto-cols-auto md:grid-cols-4 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pt-2 pb-4 md:pt-2 md:pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none"
      >
        {stats.map(({ label, value, icon, cardBg, iconBg }) => (
          <div
            key={label}
            className={`snap-start min-w-0 rounded-2xl p-5 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 shadow-md ${cardBg}`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-semibold opacity-90">{label}</span>
              <span
                className={`material-symbols-outlined text-base p-2 rounded-xl backdrop-blur-sm ${iconBg}`}
              >
                {icon}
              </span>
            </div>
            <div className="font-bold tracking-tight" style={{ fontSize: "32px", lineHeight: "36px" }}>
              {value}
            </div>
          </div>
        ))}
      </div>
      
      {/* Left Arrow (Mobile Only) */}
      <div 
        className={`absolute top-0 left-0 bottom-0 flex items-center md:hidden transition-opacity duration-300 pl-1 pb-2 z-10 pointer-events-none ${showLeft ? 'opacity-100' : 'opacity-0'}`}
      >
        <button 
          onClick={() => scrollBy(-200)}
          className="w-8 h-8 rounded-full bg-[#3a3a3a]/80 backdrop-blur-md flex items-center justify-center text-white shadow-md hover:bg-[#4a4a4a] transition-colors pointer-events-auto"
          aria-label="Scroll left"
        >
          <span className="material-symbols-outlined text-lg">chevron_left</span>
        </button>
      </div>

      {/* Right Arrow (Mobile Only) */}
      <div 
        className={`absolute top-0 right-0 bottom-0 flex items-center justify-end md:hidden transition-opacity duration-300 pr-1 pb-2 z-10 pointer-events-none ${showRight ? 'opacity-100' : 'opacity-0'}`}
      >
        <button 
          onClick={() => scrollBy(200)}
          className="w-8 h-8 rounded-full bg-[#3a3a3a]/80 backdrop-blur-md flex items-center justify-center text-white shadow-md hover:bg-[#4a4a4a] transition-colors pointer-events-auto"
          aria-label="Scroll right"
        >
          <span className="material-symbols-outlined text-lg">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
