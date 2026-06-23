"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const isModalRoute = [
    '/about', 
    '/contact', 
    '/privacy', 
    '/terms', 
    '/editorial-policy', 
    '/correction-policy'
  ].includes(pathname || '');

  if (isModalRoute) {
    return <div className="w-full flex-1 animate-in fade-in duration-150">{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.35, 
        ease: [0.22, 1, 0.36, 1]
      }}
      className="w-full flex-1"
    >
      {children}
    </motion.div>
  );
}
