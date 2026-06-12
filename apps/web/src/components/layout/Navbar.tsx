"use client";

import { ChevronDown, ChevronLeft, ChevronRight, Menu, X, Search, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import type { TopicCategoryData } from "@/components/home/TopicSection";
import type { ArticleWithAuthor } from "@/utils/mapArticleData";
import { useTranslateToggle } from "./GoogleTranslate";
import { MobileThemeToggle } from "./MobileThemeToggle";

function getImageUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`;
}

export function Navbar({ 
  categories = [],
  topArticles = [],
  navRegions = [],
  navCategories = []
}: { 
  categories?: TopicCategoryData[],
  topArticles?: ArticleWithAuthor[],
  navRegions?: { name: string, slug: string }[],
  navCategories?: { name: string, slug: string }[]
}) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [lastActiveMenu, setLastActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRegionsOpen, setIsRegionsOpen] = useState(false);
  const { lang: translateLang, toggle: toggleTranslate } = useTranslateToggle();
  const scrollRef = useRef<HTMLDivElement>(null);

  if (activeMenu && activeMenu !== lastActiveMenu && activeMenu !== "Home") {
    setLastActiveMenu(activeMenu);
  }

  const dynamicLinks = [
    ...navRegions.map(r => ({ name: r.name, slug: r.slug })),
    ...navCategories.map(c => ({ name: c.name, slug: c.slug }))
  ];

  const VISIBLE_COUNT = 6;
  const visibleLinks = [
    { name: "Home", slug: "" },
    ...dynamicLinks.slice(0, VISIBLE_COUNT - 1)
  ];
  const dropdownLinks = dynamicLinks.slice(VISIBLE_COUNT - 1);

  const getArticlesForLink = (linkName: string) => {
    if (linkName === "Home") return topArticles;
    const cat = categories.find(c => c.title.toLowerCase() === linkName.toLowerCase());
    if (cat && cat.articles.length > 0) return cat.articles;
    
    const seed = linkName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const startIndex = seed % Math.max(1, topArticles.length - 10);
    return topArticles.slice(startIndex, startIndex + 10);
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 350;
      scrollRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDown.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
  };

  const handleMouseUp = () => {
    isDown.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // Scroll-fast
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const isMoreOpen = activeMenu === "More" || (activeMenu && dropdownLinks.some(l => l.name === activeMenu));
  const isMegaMenuOpen = !!activeMenu && activeMenu !== "Home" && activeMenu !== "More";

  const renderMegaMenu = () => {
    const targetMenu = (activeMenu && activeMenu !== "Home" && activeMenu !== "More") ? activeMenu : lastActiveMenu;
    const articles = targetMenu && targetMenu !== "Home" && targetMenu !== "More" ? getArticlesForLink(targetMenu).slice(0, 10) : [];

    return (
      <div 
        className={`absolute top-full left-0 w-full bg-white dark:bg-news-bg shadow-xl z-50 transition-all duration-500 ease-in-out overflow-hidden ${isMegaMenuOpen ? 'max-h-[600px] opacity-100 border-t border-gray-200 dark:border-news-border' : 'max-h-0 opacity-0 border-t-transparent'}`}
      >
        <div className="w-full">
          {articles.length > 0 && (
            <div 
              key={targetMenu}
              className="w-full p-6 pb-16 relative animate-in fade-in slide-in-from-left-4 duration-300 ease-out"
            >
              <div 
                ref={scrollRef} 
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none cursor-grab active:cursor-grabbing select-none"
              >
                <div className="flex gap-6 w-max">
                  {articles.map((art) => (
                    <Link key={art.id} href={`/article/${art.slug}`} className="w-[280px] shrink-0 group/article block" draggable={false}>
                      <div className="relative w-full aspect-video bg-gray-100 dark:bg-news-card mb-4 overflow-hidden">
                        {art.featured_image && (
                          <Image
                            src={getImageUrl(art.featured_image)!}
                            alt={art.title}
                            fill
                            sizes="280px"
                            draggable={false}
                            className="object-cover group-hover/article:scale-105 transition-transform duration-500 pointer-events-none"
                          />
                        )}
                      </div>
                      <h4 className="font-playfair font-bold text-[17px] leading-snug line-clamp-2 group-hover/article:text-red-600 dark:group-hover/article:text-news-accent transition-colors">
                        {art.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="absolute bottom-4 right-6 flex gap-2">
                <button 
                  onClick={() => scroll('left')} 
                  className="p-2 bg-gray-100 dark:bg-news-card hover:bg-gray-200 dark:hover:bg-news-border text-gray-600 dark:text-news-text hover:text-black dark:hover:text-white rounded-full transition-colors shadow-sm"
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => scroll('right')} 
                  className="p-2 bg-gray-100 dark:bg-news-card hover:bg-gray-200 dark:hover:bg-news-border text-gray-600 dark:text-news-text hover:text-black dark:hover:text-white rounded-full transition-colors shadow-sm"
                  aria-label="Scroll right"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-90 bg-white dark:bg-news-bg flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-news-border">
        <button onClick={() => setIsMobileMenuOpen(true)}>
          <Menu size={28} strokeWidth={1.5} />
        </button>
        <Link href="/" className="flex items-center gap-3">
          <svg width="45" height="27" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="40" r="20" fill="#FF8C00"/>
            <path d="M50 10 L50 0 M20 20 L10 10 M80 20 L90 10" stroke="#FF8C00" strokeWidth="2"/>
            <path d="M30 15 L25 5 M70 15 L75 5 M40 12 L38 2 M60 12 L62 2" stroke="#FF8C00" strokeWidth="1.5"/>
            <path d="M0 60 L30 20 L50 40 L70 10 L100 60 Z" fill="#808080"/>
            <path d="M30 20 L40 35 L50 40 L40 50 Z" fill="#A0A0A0"/>
            <path d="M70 10 L60 30 L50 40 L65 50 Z" fill="#909090"/>
            <path d="M30 20 L25 28 L32 25 L38 32 Z" fill="white"/>
            <path d="M70 10 L63 22 L72 18 L78 25 Z" fill="white"/>
          </svg>
          <span className="font-playfair font-black tracking-tight uppercase text-[22px]">
            BHARATENDU SHIKHAR
          </span>
        </Link>
        <div className="w-7"></div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-100 bg-white dark:bg-news-bg flex flex-col h-dvh">
          {!isSettingsOpen ? (
            <>
              <div className="p-5 pb-2">
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X size={28} strokeWidth={2.5} />
                </button>
              </div>
              <div className="px-5 pb-6">
                <div className="border border-black dark:border-news-border flex items-center px-3 py-3">
                  <Search size={20} className="mr-3 text-black dark:text-news-text" />
                  <input type="text" placeholder="SEARCH BHARATENDU SHIKHAR" className="w-full text-[15px] outline-none placeholder:text-black dark:placeholder:text-news-text-muted placeholder:font-medium bg-transparent dark:text-news-text" />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto px-5">
                 <Link href="/election" onClick={() => setIsMobileMenuOpen(false)} className="block text-red-600 font-bold uppercase tracking-wide py-4 border-b border-gray-300 dark:border-news-border">ELECTIONS</Link>
                 <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-4 border-b border-gray-300 dark:border-news-border font-medium text-[16px] dark:text-news-text">Home</Link>
                 <Link href="/politics" onClick={() => setIsMobileMenuOpen(false)} className="block py-4 border-b border-gray-300 dark:border-news-border font-medium text-[16px] dark:text-news-text">Politics</Link>
                 <Link href="/entertainment" onClick={() => setIsMobileMenuOpen(false)} className="block py-4 border-b border-gray-300 dark:border-news-border font-medium text-[16px] dark:text-news-text">Entertainment</Link>
                 <Link href="/sports" onClick={() => setIsMobileMenuOpen(false)} className="block py-4 border-b border-gray-300 dark:border-news-border font-medium text-[16px] dark:text-news-text">Sports</Link>
                 
                 <div className="border-b border-black dark:border-news-border">
                   <button onClick={() => setIsRegionsOpen(!isRegionsOpen)} className="w-full py-4 flex justify-between items-center font-medium text-[16px] dark:text-news-text">
                     Regions
                     <ChevronDown size={20} strokeWidth={1.5} className={`transition-transform ${isRegionsOpen ? 'rotate-180' : ''}`} />
                   </button>
                   {isRegionsOpen && (
                     <div className="flex flex-col pb-2">
                       {navRegions.map((region, idx) => (
                         <Link key={region.slug} href={`/${region.slug}`} onClick={() => setIsMobileMenuOpen(false)} className={`block py-4 px-2 text-gray-600 dark:text-news-text-secondary border-b border-gray-300 dark:border-news-border ${idx === navRegions.length - 1 ? 'border-b-0' : ''}`}>
                           {region.name}
                         </Link>
                       ))}
                     </div>
                   )}
                 </div>
              </div>

              <div className="bg-gray-200 dark:bg-news-card p-5 mt-auto">
                <button onClick={() => setIsSettingsOpen(true)} className="flex items-center justify-end w-full gap-3 text-[15px] font-medium dark:text-news-text">
                  Settings <Settings size={20} />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="p-5 pb-6">
                <button onClick={() => setIsSettingsOpen(false)}>
                  <X size={28} strokeWidth={2.5} />
                </button>
              </div>
              <div className="px-5">
                <h2 className="text-red-600 text-2xl font-bold border-b border-black dark:border-news-border pb-4 mb-2">Settings</h2>
                <div className="flex justify-between items-center py-5 border-b border-gray-300 dark:border-news-border">
                  <span className="font-medium text-[16px] dark:text-news-text">Theme</span>
                  <MobileThemeToggle />
                </div>
                <div className="flex justify-between items-center py-5 border-b border-gray-300 dark:border-news-border">
                  <span className="font-medium text-[16px] dark:text-news-text">Language</span>
                  <button
                    onClick={toggleTranslate}
                    className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-medium"
                  >
                    {translateLang === "en" ? "हिंदी" : "English"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Desktop Nav */}
      <nav className="hidden lg:block w-full max-w-[1400px] mx-auto px-4 mb-2 relative z-100" onMouseLeave={() => setActiveMenu(null)}>
        <div className="flex justify-between items-center text-sm font-medium">
          <div className="flex gap-8 items-center h-full">
            {visibleLinks.map((link) => (
              <div 
                key={link.name} 
                className="h-full"
                onMouseEnter={() => setActiveMenu(link.name === "Home" ? null : link.name)}
              >
                <Link href={link.slug === "" ? "/" : `/${link.slug}`} className="flex items-center gap-1 hover:text-red-600 py-4">
                  {link.name} {link.name !== "Home" && <ChevronDown size={14} className="text-gray-400"/>}
                </Link>
              </div>
            ))}

            {dropdownLinks.length > 0 && (
              <div 
                className="relative cursor-pointer h-full"
                onMouseEnter={() => setActiveMenu("More")}
              >
                <div className="flex items-center gap-1 hover:text-red-600 py-4">
                  More <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isMoreOpen ? 'rotate-180' : ''}`}/>
                </div>
                
                <div 
                  className={`absolute top-full left-0 z-60 w-full min-w-[200px] transition-all duration-300 ease-in-out overflow-hidden ${isMoreOpen ? 'max-h-[500px] opacity-100 pt-2' : 'max-h-0 opacity-0 pt-0'}`}
                >
                  <div className="w-full">
                    <div className="bg-white dark:bg-news-card border border-gray-200 dark:border-news-border shadow-xl py-2 flex flex-col">
                      {dropdownLinks.map(link => (
                        <div 
                          key={link.name} 
                          className="relative"
                          onMouseEnter={() => setActiveMenu(link.name)}
                        >
                          <Link href={`/${link.slug}`} className="px-6 py-3 hover:bg-gray-50 dark:hover:bg-news-bg hover:text-red-600 dark:hover:text-news-accent transition-colors flex items-center justify-between dark:text-news-text">
                            {link.name} <ChevronDown size={14} className="text-gray-400 -rotate-90"/>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div>
            <Link href="/election" className="text-red-600 font-bold uppercase tracking-widest hover:underline py-4 inline-block">ELECTION</Link>
          </div>
        </div>
        {renderMegaMenu()}
      </nav>
      
      <div className="hidden lg:block w-full max-w-[1400px] mx-auto px-4">
        <div className="h-[2px] w-full bg-gray-400 dark:bg-news-border mb-6"></div>
      </div>
    </>
  );
}
