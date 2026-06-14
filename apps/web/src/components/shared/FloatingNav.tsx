"use client";

import Link from "next/link";
import { BookOpen, Home, Search } from "lucide-react";
import { useSearch } from "@/context/SearchContext";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingNav() {
  const { openSearch } = useSearch();

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
          className="floating-nav md:hidden fixed bottom-6 left-0 right-0 mx-auto w-fit z-50 flex items-center gap-6 bg-red-600/95 dark:bg-red-700/95 backdrop-blur-md shadow-[0_8px_30px_rgb(220,38,38,0.3)] rounded-full px-8 py-3 border border-red-500/50"
        >
          <Link href="/" className="flex flex-col items-center gap-1 text-white/80 hover:text-white transition-colors w-12">
            <Home size={20} strokeWidth={2} />
            <span className="text-[11px] font-bold tracking-widest">Home</span>
          </Link>
          
          <div className="w-px h-8 bg-white/20 mx-1"></div>
          
          <Link href="/epaper" className="group flex flex-col items-center gap-1 text-white transition-colors w-16 relative">
            <div className="absolute -top-7 bg-gray-200 text-red-600 rounded-full p-3 shadow-lg shadow-black/10 group-hover:bg-gray-100 group-hover:-translate-y-1 transition-all">
              <BookOpen size={22} strokeWidth={2} />
            </div>
            <div className="h-4"></div>
            <span className="text-[11px] font-semibold tracking-widest mt-1">E-Paper</span>
          </Link>
          
          <div className="w-px h-8 bg-white/20 mx-1"></div>
          
          <button onClick={() => openSearch()} className="flex flex-col items-center gap-1 text-white/80 hover:text-white transition-colors w-12">
            <Search size={20} strokeWidth={2} />
            <span className="text-[11px] font-bold tracking-widest">Search</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
