"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * Wraps children with animations based on the current route.
 *
 * Modal routes (`/about`, `/contact`, `/privacy`, `/terms`, `/editorial-policy`, `/correction-policy`) receive CSS fade-in animation, while other routes receive framer-motion animation with fade-in and upward slide effects.
 */
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
