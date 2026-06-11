import { Search } from "lucide-react";

export function Header() {
  return (
    <header className="hidden lg:block py-6 px-4 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center">
        <div className="w-48 text-sm text-gray-700 dark:text-news-text-secondary space-y-1">
          <p>Monday, May 11, 2026</p>
          <p>Today&apos;s Paper</p>
        </div>
        
        <div className="flex items-center gap-6">
          <svg width="100" height="60" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="40" r="20" fill="#FF8C00"/>
            <path d="M50 10 L50 0 M20 20 L10 10 M80 20 L90 10" stroke="#FF8C00" strokeWidth="2"/>
            <path d="M30 15 L25 5 M70 15 L75 5 M40 12 L38 2 M60 12 L62 2" stroke="#FF8C00" strokeWidth="1.5"/>
            <path d="M0 60 L30 20 L50 40 L70 10 L100 60 Z" fill="#808080"/>
            <path d="M30 20 L40 35 L50 40 L40 50 Z" fill="#A0A0A0"/>
            <path d="M70 10 L60 30 L50 40 L65 50 Z" fill="#909090"/>
            <path d="M30 20 L25 28 L32 25 L38 32 Z" fill="white"/>
            <path d="M70 10 L63 22 L72 18 L78 25 Z" fill="white"/>
          </svg>
          <h1 className="text-5xl md:text-6xl font-playfair font-black tracking-tight">
            Bharatendu Shikhar
          </h1>
        </div>

        <div className="w-48 flex justify-end items-center gap-6">
          <button className="flex items-center gap-2 hover:text-red-600 dark:hover:text-news-accent transition-colors ml-auto text-black dark:text-news-text">
            <Search size={20} strokeWidth={1.5} /> <span className="text-sm font-medium">Search</span>
          </button>
        </div>
      </div>
    </header>
  );
}
