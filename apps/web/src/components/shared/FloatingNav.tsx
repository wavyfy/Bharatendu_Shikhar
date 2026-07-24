"use client";

import Link from "next/link";
import { BookOpenText, Home, Vote, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingNav() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="floating-nav md:hidden fixed bottom-4 left-0 right-0 mx-auto w-fit max-w-[95vw] overflow-x-auto no-scrollbar z-50 flex items-center gap-4 bg-red-600/95 dark:bg-red-700/95 backdrop-blur-md shadow-[0_8px_30px_rgb(220,38,38,0.3)] rounded-full px-6 py-2 border border-red-500/50"
        >
          <Link href="/" className="flex flex-col items-center gap-1 text-white hover:text-white transition-colors w-12">
            <Home size={20} strokeWidth={2} />
            <span className="text-[11px] font-bold tracking-widest">होम</span>
          </Link>
          
          <div className="w-px h-8 bg-white/40 shrink-0"></div>
          
          <Link href="/elections" className="flex flex-col items-center gap-1 text-white hover:text-white transition-colors w-12">
            <Vote size={20} strokeWidth={2} />
            <span className="text-[11px] font-bold tracking-widest">चुनाव</span>
          </Link>
          
          <div className="w-px h-8 bg-white/40 shrink-0"></div>
          
          <Link href="/sports" className="flex flex-col items-center gap-1 text-white hover:text-white transition-colors w-12">
            <Trophy size={20} strokeWidth={2} />
            <span className="text-[11px] font-bold tracking-widest">खेल</span>
          </Link>

          <div className="w-px h-8 bg-white/40 shrink-0"></div>
          
          <Link href="/epaper" className="group flex flex-col items-center gap-1 text-white transition-colors w-16 relative">
            <div className="absolute text-white group-hover:text-white group-hover:-translate-y-1 transition-all">
              <BookOpenText size={22} strokeWidth={2} />
            </div>
            <div className="h-4"></div>
            <span className="text-[11px] font-semibold tracking-widest mt-1">E-Paper</span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
