"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] // Super smooth premium ease curve
      }}
      className="w-full flex-1"
    >
      {children}
    </motion.div>
  );
}
