"use client";

import { Activity } from "lucide-react";
import { usePathname } from "next/navigation";

export function SportsHeader() {
  const pathname = usePathname();

  if (pathname !== "/sports" && pathname !== "/sports/competitions") {
    return null;
  }

  return (
    <div className="relative w-full bg-news-card border-b border-news-border overflow-hidden -mt-20">
      {/* Background slanted stripes - very faint */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" 
        style={{ 
          backgroundImage: 'repeating-linear-gradient(45deg, currentColor 0, currentColor 40px, transparent 40px, transparent 80px)' 
        }}
      ></div>
      
      <div 
        className="absolute top-0 bottom-0 right-0 w-32 md:w-[350px] bg-[#e60000]" 
        style={{ clipPath: 'polygon(25% 100%, 100% 100%, 100% 0, 85% 0)' }}
      >
        <div className="absolute top-0 bottom-0 right-0 w-4 bg-[#cc0000]"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-24 md:pt-20 pb-4 md:pb-6 relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="w-8 h-8 md:w-9 md:h-9 text-red-600 stroke-[2.5]" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-news-text tracking-tight">खेल</h1>
        </div>
        <p className="text-news-text-secondary text-sm md:text-[15px] font-medium">
          लाइव स्कोर, शेड्यूल, अंक तालिकाएं — क्रिकेट और फुटबॉल
        </p>
      </div>
    </div>
  );
}
