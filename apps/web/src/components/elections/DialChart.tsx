export function DialChart({ 
  totalSeats, 
  majority, 
  leadingSeats, 
  losingSeats, 
  yetToWin 
}: { 
  totalSeats: number;
  majority: number;
  leadingSeats: number;
  losingSeats: number;
  yetToWin: number;
}) {
  const circumference = 90 * Math.PI; // Hardcoded radius 90 in SVG path M 10 100 A 90 90 0 0 1 190 100

  // Calculate the percentage of the arc to fill (based on total seats)
  const leadingRatio = totalSeats === 0 ? 0 : leadingSeats / totalSeats;
  const leadingStrokeDashoffset = circumference - leadingRatio * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-card h-full">
      <div className="w-full flex justify-between items-end border-b border-gray-200 dark:border-news-border pb-4 mb-8">
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">कुल सीटें</p>
          <p className="text-3xl font-black text-red-600">{totalSeats}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">बहुमत</p>
          <p className="text-2xl font-black text-foreground">{majority}</p>
        </div>
      </div>

      <div className="relative w-[240px] h-[120px] flex items-end justify-center mb-10">
        <svg 
          viewBox="0 0 200 100" 
          className="w-full h-full overflow-visible"
        >
          {/* Background Arc (Dark Gray/Black) */}
          <path
            d="M 10 100 A 90 90 0 0 1 190 100"
            fill="none"
            stroke="currentColor"
            className="text-foreground dark:text-muted"
            strokeWidth="20"
            strokeLinecap="butt"
          />
          {/* Foreground Arc (Red - Leading) */}
          <path
            d="M 10 100 A 90 90 0 0 1 190 100"
            fill="none"
            stroke="#dc2626" // text-red-600
            strokeWidth="20"
            strokeLinecap="butt"
            strokeDasharray={circumference}
            strokeDashoffset={leadingStrokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute bottom-0 left-0 right-0 text-center mb-[-10px]">
          <p className="text-3xl font-black leading-snug text-foreground">{majority}</p>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">जीतने के लिए</p>
        </div>
      </div>

      {/* Legend below chart */}
      <div className="flex gap-2 w-full mt-auto pt-4">
        <div className="flex-1 border-2 border-gray-200 dark:border-news-border p-3 rounded-sm flex flex-col items-center justify-center bg-card">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-600"></div>
            <p className="text-sm font-bold text-foreground">{leadingSeats}</p>
          </div>
          <p className="text-[10px] font-bold text-foreground uppercase tracking-widest">बढ़त</p>
        </div>
        <div className="flex-1 border-2 border-gray-200 dark:border-news-border p-3 rounded-sm flex flex-col items-center justify-center bg-card">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-foreground"></div>
            <p className="text-sm font-bold text-foreground">{losingSeats}</p>
          </div>
          <p className="text-[10px] font-bold text-foreground uppercase tracking-widest">पीछे</p>
        </div>
        <div className="flex-1 border-2 border-gray-200 dark:border-news-border p-3 rounded-sm flex flex-col items-center justify-center bg-card">
          <div className="flex items-center gap-2 mb-1.5">
            <p className="text-sm font-bold text-foreground">{yetToWin}</p>
          </div>
          <p className="text-[10px] font-bold text-foreground uppercase tracking-widest whitespace-nowrap">बाकी</p>
        </div>
      </div>
    </div>
  );
}
