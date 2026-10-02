"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenText, Home, Vote, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingNav() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/", label: "होम", icon: Home },
    { href: "/elections", label: "चुनाव", icon: Vote },
    { href: "/sports", label: "खेल", icon: Trophy },
    { href: "/epaper", label: "ई-पेपर", icon: BookOpenText },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="floating-nav md:hidden fixed bottom-4 left-0 right-0 mx-auto w-fit max-w-[95vw] overflow-x-auto no-scrollbar z-50 flex items-center gap-3 bg-[#E7000B] text-white backdrop-blur-md shadow-[0_8px_25px_rgba(231,0,11,0.45)] rounded-3xl px-7 py-3 border border-white/20"
        >
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = item.href === "/" 
              ? pathname === "/" 
              : pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <div key={item.href} className="flex items-center gap-3">
                {idx > 0 && <div className="w-px h-9 bg-white/30 shrink-0"></div>}
                <Link 
                  href={item.href} 
                  className={`flex flex-col items-center justify-center gap-1 text-white transition-opacity duration-200 min-w-14 px-1 ${
                    isActive ? "opacity-100 font-semibold" : "opacity-75 hover:opacity-100 active:opacity-100 font-medium"
                  }`}
                >
                  <Icon size={22} strokeWidth={2} />
                  <span className="text-[11px] tracking-wide whitespace-nowrap">{item.label}</span>
                </Link>
              </div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
