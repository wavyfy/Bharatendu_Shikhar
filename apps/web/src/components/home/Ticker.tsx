export function Ticker() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 mb-10">
      <div className="flex items-stretch text-xs">
        <div className="bg-red-600 text-white font-bold px-4 py-2 uppercase tracking-wide">
          TODAY&apos;S HEADLINES
        </div>
        <div className="bg-red-600 text-white flex-1 py-2 px-6 flex gap-10 overflow-hidden">
          <span className="whitespace-nowrap border-l border-white/40 pl-6">1. US and French nationals test positive for hantavirus after leaving ship</span>
          <span className="whitespace-nowrap border-l border-white/40 pl-6">2. How hotels are stopping the &apos;dawn dash&apos; for sunbeds after man wins payout</span>
        </div>
      </div>
    </div>
  );
}
