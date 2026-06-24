"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { User } from "lucide-react";

interface Candidate {
  id: string;
  candidate_name: string;
  party_name?: string | null;
  photo_url?: string | null;
  votes?: number;
  is_winner?: boolean;
}

interface Group {
  id: string;
  candidates: Candidate[];
}

export function TopLeadersCarousel({ topLeaders, sortedGroups }: { topLeaders: Candidate[], sortedGroups: Group[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollLeft = scrollRef.current.scrollLeft;
        const width = scrollRef.current.offsetWidth;
        const index = Math.round(scrollLeft / width);
        setCurrentIndex(index);
      }
    };

    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
      return () => currentRef.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const scrollTo = (index: number) => {
    if (scrollRef.current) {
      const width = scrollRef.current.offsetWidth;
      scrollRef.current.scrollTo({ left: width * index, behavior: 'smooth' });
    }
  };

  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDown.current = true;
    if (scrollRef.current) {
      startX.current = e.pageX - scrollRef.current.offsetLeft;
      scrollLeftPos.current = scrollRef.current.scrollLeft;
      scrollRef.current.style.cursor = 'grabbing';
      scrollRef.current.style.scrollSnapType = 'none';
    }
  };

  const handleMouseLeave = () => {
    isDown.current = false;
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
      scrollRef.current.style.scrollSnapType = 'x mandatory';
    }
  };

  const handleMouseUp = () => {
    isDown.current = false;
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
      scrollRef.current.style.scrollSnapType = 'x mandatory';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    scrollRef.current.scrollLeft = scrollLeftPos.current - walk;
  };

  if (topLeaders.length === 0) {
    return (
      <div className="col-span-full p-8 text-center border-2 border-gray-200 dark:border-news-border rounded-sm text-muted-foreground text-sm">
        No leaders available yet.
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex overflow-x-auto gap-4 snap-x snap-mandatory pb-4 hide-scrollbar cursor-grab"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}} />
        {topLeaders.map((leader: Candidate) => {
          const group = sortedGroups.find((g: Group) => g.candidates.some(c => c.id === leader.id));
          const isActuallyLeading = group?.candidates[0].id === leader.id && leader.votes! > 0;
          const badgeStatus = leader.is_winner ? "WON" : isActuallyLeading ? "LEADING" : "LOSING";
          
          return (
            <div key={leader.id} className="min-w-full md:min-w-[260px] shrink-0 snap-center bg-card border-2 border-gray-200 dark:border-news-border rounded-sm p-5 flex flex-col justify-between">
              <div className="flex gap-4 mb-6">
                <div className="w-16 h-16 shrink-0 relative rounded-sm overflow-hidden bg-muted">
                  {leader.photo_url ? (
                    <Image src={leader.photo_url} alt={leader.candidate_name} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted/50">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="pt-1">
                  <h3 className="font-medium text-sm leading-relaxed mb-1.5 text-foreground">{leader.candidate_name}</h3>
                  <p className="text-xs font-medium text-red-600 leading-snug">{leader.party_name || "Independent"}</p>
                </div>
              </div>
              <div>
                <span className={`inline-block px-3 py-1 text-xs font-bold rounded-sm ${
                  badgeStatus === "WON" 
                    ? "bg-green-600 text-white" 
                    : badgeStatus === "LEADING" 
                      ? "bg-red-600 text-white" 
                      : "bg-gray-600 text-white"
                }`}>
                  {badgeStatus === "WON" ? "विजयी" : badgeStatus === "LEADING" ? "बढ़त" : "पीछे"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-2">
        {topLeaders.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollTo(idx)}
            className={`w-2 h-2 rounded-full transition-colors ${
              currentIndex === idx ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
