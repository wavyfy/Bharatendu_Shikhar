"use client";

import { ChevronDown, ChevronLeft, ChevronRight, Menu, X, Search, Settings, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TopicCategoryData } from "@/components/home/TopicSection";
import type { ArticleWithAuthor } from "@/utils/mapArticleData";
import { useTranslateToggle } from "./GoogleTranslate";
import { MobileThemeToggle } from "./MobileThemeToggle";
import { useSearch } from "@/context/SearchContext";

function getImageUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`;
}

export function Navbar({ 
  categories = [],
  topArticles = [],
  navRegions = [],
  navCategories = [],
  logoUrl,
  logoDarkUrl
}: { 
  categories?: TopicCategoryData[],
  topArticles?: ArticleWithAuthor[],
  navRegions?: { name: string, slug: string }[],
  navCategories?: { name: string, slug: string }[],
  logoUrl?: string | null,
  logoDarkUrl?: string | null
}) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [lastActiveMenu, setLastActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRegionsOpen, setIsRegionsOpen] = useState(false);
  const { lang: translateLang, toggle: toggleTranslate } = useTranslateToggle();
  const { openSearch } = useSearch();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  if (activeMenu && activeMenu !== lastActiveMenu && activeMenu !== "Home") {
    setLastActiveMenu(activeMenu);
  }

  const dynamicLinks = [
    ...navRegions.map(r => ({ name: r.name, slug: r.slug })),
    ...navCategories.map(c => ({ name: c.name, slug: c.slug }))
  ];

  const VISIBLE_COUNT = 7;
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
      <AnimatePresence>
        {isMegaMenuOpen && articles.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-white dark:bg-news-bg shadow-xl z-50 border-t border-gray-200 dark:border-news-border"
          >
            <div className="w-full">
              <div 
                key={targetMenu}
                className="w-full p-6 pb-16 relative"
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
                        <div className="relative w-full aspect-video bg-gray-100 dark:bg-news-card mb-4 overflow-hidden rounded-[2px]">
                          {art.featured_image && (
                            <Image
                              src={getImageUrl(art.featured_image)!}
                              alt={art.title}
                              fill
                              sizes="280px"
                              draggable={false}
                              className="object-cover transition-transform duration-500 ease-out pointer-events-none"
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-90 bg-white dark:bg-news-bg flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-news-border">
        <button onClick={() => setIsMobileMenuOpen(true)}>
          <Menu size={28} strokeWidth={1.5} />
        </button>
        <Link href="/" onClick={(e) => {
          if (window.location.pathname === '/') {
            e.preventDefault();
            window.location.reload();
          }
        }} className="flex items-center outline-none">
          {logoUrl || logoDarkUrl ? (
            <>
              {logoUrl && (
                <div className={logoDarkUrl ? "dark:hidden" : ""}>
                  <Image 
                    src={logoUrl.startsWith("http") ? logoUrl : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${logoUrl}`} 
                    alt="Bhartendu Shikhar Logo" 
                    width={200} 
                    height={40} 
                    className="w-auto h-[40px] object-contain"
                    style={{ width: "auto" }}
                    priority
                  />
                </div>
              )}
              {logoDarkUrl && (
                <div className={logoUrl ? "hidden dark:block" : ""}>
                  <Image 
                    src={logoDarkUrl.startsWith("http") ? logoDarkUrl : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${logoDarkUrl}`} 
                    alt="Bhartendu Shikhar Logo (Dark)" 
                    width={200} 
                    height={40} 
                    className="w-auto h-[40px] object-contain"
                    style={{ width: "auto" }}
                    priority
                  />
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="font-playfair font-black tracking-tight uppercase text-[22px]">
                BHARTENDU SHIKHAR
              </span>
            </div>
          )}
        </Link>
        <div className="w-7"></div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-0 z-100 bg-white dark:bg-news-bg flex flex-col h-dvh shadow-2xl"
          >
            {!isSettingsOpen ? (
              <>
                <div className="p-5 pb-2">
                  <button onClick={() => setIsMobileMenuOpen(false)}>
                    <X size={28} strokeWidth={1.5} />
                  </button>
                </div>
                <div className="px-5 pb-6">
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setTimeout(() => openSearch(), 50);
                    }}
                    className="group relative flex items-center w-full bg-gray-100 dark:bg-news-bg hover:bg-gray-200 dark:hover:bg-[#1A1A1A] border border-gray-200 dark:border-news-border rounded-full h-[46px] text-gray-500 dark:text-news-text-muted hover:text-black dark:hover:text-white transition-colors overflow-hidden"
                  >
                    <span className="ml-5 text-[15px] font-medium tracking-wide">Search Articles...</span>
                    <div className="absolute right-[3px] top-[3px] bottom-[3px] w-[40px] bg-white dark:bg-news-card rounded-full flex items-center justify-center shadow-sm">
                      <Search size={18} strokeWidth={2.5} className="text-gray-600 dark:text-news-text transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3" />
                    </div>
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto px-5">
                   <Link href="/election" onClick={() => setIsMobileMenuOpen(false)} className="block text-red-600 font-bold uppercase tracking-wide py-4 border-b border-gray-300 dark:border-news-border">ELECTIONS</Link>
                   <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-4 border-b border-gray-300 dark:border-news-border font-medium text-[16px] dark:text-news-text hover:text-red-600 transition-colors">Home</Link>
                   <Link href="/politics" onClick={() => setIsMobileMenuOpen(false)} className="block py-4 border-b border-gray-300 dark:border-news-border font-medium text-[16px] dark:text-news-text hover:text-red-600 transition-colors">Politics</Link>
                   <Link href="/entertainment" onClick={() => setIsMobileMenuOpen(false)} className="block py-4 border-b border-gray-300 dark:border-news-border font-medium text-[16px] dark:text-news-text hover:text-red-600 transition-colors">Entertainment</Link>
                   <Link href="/sports" onClick={() => setIsMobileMenuOpen(false)} className="block py-4 border-b border-gray-300 dark:border-news-border font-medium text-[16px] dark:text-news-text hover:text-red-600 transition-colors">Sports</Link>
                   
                   <div className="border-b border-black dark:border-news-border">
                     <button onClick={() => setIsRegionsOpen(!isRegionsOpen)} className="w-full py-4 flex justify-between items-center font-medium text-[16px] dark:text-news-text hover:text-red-600 transition-colors">
                       Regions
                       <ChevronDown size={20} strokeWidth={1.5} className={`transition-transform duration-300 ${isRegionsOpen ? 'rotate-180' : ''}`} />
                     </button>
                     <AnimatePresence>
                       {isRegionsOpen && (
                         <motion.div 
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: "auto", opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                           transition={{ duration: 0.2 }}
                           className="flex flex-col pb-2 overflow-hidden"
                         >
                           {navRegions.map((region, idx) => (
                             <Link key={region.slug} href={`/${region.slug}`} onClick={() => setIsMobileMenuOpen(false)} className={`block py-4 px-2 text-gray-600 dark:text-news-text-secondary border-b border-gray-300 dark:border-news-border hover:text-black dark:hover:text-white transition-colors ${idx === navRegions.length - 1 ? 'border-b-0' : ''}`}>
                               {region.name}
                             </Link>
                           ))}
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </div>
                </div>

                <div className="bg-gray-200 dark:bg-news-card p-5 mt-auto">
                  <button onClick={() => setIsSettingsOpen(true)} className="flex items-center justify-end w-full gap-3 text-[15px] font-medium dark:text-news-text hover:text-red-600 transition-colors">
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
                      className="group flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-700 transition-colors"
                      aria-label="Toggle language"
                    >
                      <Globe size={16} className="transition-transform duration-500 group-hover:rotate-180" />
                      <span>{translateLang === "en" ? "हिंदी" : "English"}</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
                <Link href={link.slug === "" ? "/" : `/${link.slug}`} className={`flex items-center gap-[4px] py-4 transition-colors ${activeMenu === link.name ? 'text-red-600 dark:text-news-accent' : 'hover:text-red-600 dark:hover:text-news-accent'}`}>
                  {link.name} {link.name !== "Home" && <ChevronDown size={14} strokeWidth={2.5} className={`transition-all duration-300 ${activeMenu === link.name ? '-rotate-180 text-red-600 dark:text-news-accent' : 'text-gray-400'}`}/>}
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
                
                <AnimatePresence>
                  {isMoreOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 z-60 w-full min-w-[200px] pt-2"
                    >
                      <div className="w-full">
                        <div className="bg-white dark:bg-news-card border border-gray-200 dark:border-news-border shadow-xl py-2 flex flex-col rounded-[2px]">
                          {dropdownLinks.map(link => (
                            <div 
                              key={link.name} 
                              className="relative"
                              onMouseEnter={() => setActiveMenu(link.name)}
                            >
                              <Link href={`/${link.slug}`} className="px-6 py-3 hover:bg-gray-50 dark:hover:bg-news-bg hover:text-red-600 dark:hover:text-news-accent transition-colors flex items-center justify-between dark:text-news-text group/dropdownLink">
                                {link.name} <ChevronDown size={14} strokeWidth={2.5} className={`transition-all duration-300 ${activeMenu === link.name ? 'rotate-0 text-red-600 dark:text-news-accent' : '-rotate-90 text-gray-400'}`}/>
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
          <div>
            <Link href="/election" className="group text-red-600 font-bold uppercase tracking-widest py-4 inline-block relative overflow-hidden">
              ELECTION
              <span className="absolute bottom-3 left-0 w-full h-[2px] bg-red-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
            </Link>
          </div>
        </div>
        {renderMegaMenu()}
      </nav>
      
      <div className="hidden lg:block w-full max-w-[1400px] mx-auto px-4">
        <div className="h-[2px] w-full bg-gray-300 dark:bg-news-border mb-1"></div>
      </div>
    </>
  );
}
