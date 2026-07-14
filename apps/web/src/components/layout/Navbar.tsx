"use client";

import { ChevronDown, ChevronLeft, ChevronRight, Menu, X, Search, Settings, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
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

interface NavRegion {
  name: string;
  slug: string;
  subRegions?: NavRegion[];
}

function MobileRegionItem({ 
  region, 
  isLast, 
  pathname, 
  onClose, 
  depth = 0 
}: { 
  region: NavRegion; 
  isLast: boolean; 
  pathname: string; 
  onClose: () => void; 
  depth?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const targetPath = `/${region.slug}`;
  const isCurrentPage = pathname === targetPath.toLowerCase();
  const hasSubRegions = region.subRegions && region.subRegions.length > 0;

  return (
    <div className={`border-gray-300 dark:border-news-border ${!isLast ? 'border-b' : ''}`}>
      <div className="flex justify-between items-center pr-2">
        <Link 
          href={targetPath} 
          onClick={onClose} 
          className={`flex-1 py-4 hover:text-black dark:hover:text-white transition-colors ${isCurrentPage ? 'text-red-600 dark:text-news-accent font-medium' : 'text-gray-600 dark:text-news-text-secondary'}`}
          style={{ paddingLeft: `${(depth * 1) + 0.5}rem` }}
        >
          {region.name}
        </Link>
        {hasSubRegions && (
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-3 text-gray-500 hover:text-red-600 dark:text-news-text-secondary transition-colors"
          >
            <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
      <AnimatePresence>
        {hasSubRegions && isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col overflow-hidden"
          >
            {region.subRegions?.map((subRegion: NavRegion, idx: number) => (
              <MobileRegionItem 
                key={subRegion.slug}
                region={subRegion}
                isLast={idx === (region.subRegions?.length || 0) - 1}
                pathname={pathname}
                onClose={onClose}
                depth={depth + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
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
  navRegions?: { name: string, slug: string, subRegions?: { name: string, slug: string }[] }[],
  navCategories?: { name: string, slug: string }[],
  logoUrl?: string | null,
  logoDarkUrl?: string | null
}) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [lastActiveMenu, setLastActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRegionsOpen, setIsRegionsOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const { lang: translateLang, toggle: toggleTranslate } = useTranslateToggle();
  const { openSearch } = useSearch();
  const scrollRef = useRef<HTMLDivElement>(null);

  const isElectionLive = false; // TODO: Connect to actual live data status
  const isSportsLive = false; // TODO: Connect to actual live data status

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("menu-open");
    } else {
      document.body.style.overflow = "";
      document.body.classList.remove("menu-open");
    }
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("menu-open");
    };
  }, [isMobileMenuOpen]);

  if (activeMenu && activeMenu !== lastActiveMenu && activeMenu !== "Home" && activeMenu !== "अधिक") {
    setLastActiveMenu(activeMenu);
  }

  const rawPathname = usePathname();
  const pathname = decodeURIComponent(rawPathname.endsWith('/') && rawPathname.length > 1 ? rawPathname.slice(0, -1) : rawPathname).trim().toLowerCase();

  let activeNavRegions = navRegions;
  
  const indiaRegion = navRegions.find(r => r.name.includes("भारत") || r.name.toLowerCase().includes("india"));

  type NavRegionType = typeof navRegions[0];

  function findActiveContext(regions: NavRegionType[], currentPath: string, siblings: NavRegionType[], depth: number = 1): NavRegionType[] | null {
    for (const r of regions) {
      const cleanSlug = r.slug ? r.slug.replace(/^\/+/, '') : '';
      const regionPath = decodeURIComponent(`/${cleanSlug}`).trim().toLowerCase();
      if (regionPath === currentPath) {
        if (depth === 1) {
          // It's a Country (e.g. India). Show its states.
          return r.subRegions as NavRegionType[] || [];
        }
        if (depth === 2) {
          // It's a State. Show its cities (even if there are none, show empty).
          return r.subRegions as NavRegionType[] || [];
        }
        if (depth >= 3) {
          // It's a City. Show its sibling cities.
          return siblings;
        }
      }
      if (r.subRegions && r.subRegions.length > 0) {
        const found = findActiveContext(r.subRegions as NavRegionType[], currentPath, r.subRegions as NavRegionType[], depth + 1);
        if (found) return found;
      }
    }
    return null;
  }

  const contextRegions = findActiveContext(navRegions, pathname, navRegions);

  if (contextRegions) {
    activeNavRegions = contextRegions;
  } else if (indiaRegion && indiaRegion.subRegions && indiaRegion.subRegions.length > 0) {
    activeNavRegions = indiaRegion.subRegions as NavRegionType[];
  }

  const VISIBLE_COUNT = 7;
  const visibleRegions = activeNavRegions.slice(0, VISIBLE_COUNT - 1);
  const dropdownRegions = activeNavRegions.slice(VISIBLE_COUNT - 1);

  const visibleLinks = [
    { name: "Home", slug: "" },
    ...visibleRegions.map(r => ({ name: r.name, slug: r.slug ? decodeURIComponent(r.slug).trim().replace(/^\/+/, '') : "" }))
  ];

  const rawDropdownLinks = [
    ...(activeNavRegions !== navRegions ? navRegions.map(r => ({ name: r.name, slug: r.slug ? r.slug.replace(/^\/+/, '') : "" })) : []),
    ...dropdownRegions.map(r => ({ name: r.name, slug: r.slug ? r.slug.replace(/^\/+/, '') : "" })),
    ...navCategories.map(c => ({ name: c.name, slug: c.slug ? c.slug.replace(/^\/+/, '') : "" }))
  ];

  // Deduplicate by slug to ensure we don't show the same link twice
  const dropdownLinks = Array.from(new Map(rawDropdownLinks.map(l => [l.slug, l])).values());

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

  const isMoreOpen = activeMenu === "अधिक" || (activeMenu && dropdownLinks.some(l => l.name === activeMenu));
  const isMegaMenuOpen = !!activeMenu && activeMenu !== "Home" && activeMenu !== "अधिक";

  const renderMegaMenu = () => {
    const targetMenu = (activeMenu && activeMenu !== "Home" && activeMenu !== "अधिक") ? activeMenu : lastActiveMenu;
    const articles = targetMenu && targetMenu !== "Home" && targetMenu !== "अधिक" ? getArticlesForLink(targetMenu).slice(0, 10) : [];

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
                        <h4 className="font-medium text-[17px] leading-snug line-clamp-2 group-hover/article:text-red-600 dark:group-hover/article:text-news-accent transition-colors">
                          {art.title}
                        </h4>
                      </Link>
                    ))}
                  </div>
                </div>

                {(() => {
                  const targetRegion = navRegions.find(r => r.name === targetMenu);
                  if (targetRegion && targetRegion.subRegions && targetRegion.subRegions.length > 0) {
                    return (
                      <div className="mt-8 border-t border-gray-200 dark:border-news-border pt-6">
                        <h5 className="font-bold text-[16px] mb-4 text-red-600 dark:text-news-accent uppercase tracking-wider">उप-क्षेत्र</h5>
                        <div className="flex flex-wrap gap-x-6 gap-y-3">
                          {targetRegion.subRegions.map(sub => (
                            <Link key={sub.slug} href={`/${sub.slug}`} className="text-gray-700 dark:text-news-text hover:text-red-600 dark:hover:text-news-accent text-[15px] font-medium transition-colors">
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
                
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
              <span className="font-bold tracking-tight uppercase text-[22px]">
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
            <AnimatePresence mode="wait">
              {!isSettingsOpen ? (
                <motion.div
                  key="menu-content"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col h-full"
                >
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
                      <span className="ml-5 text-[15px] font-medium tracking-wide">लेख खोजें...</span>
                      <div className="absolute right-[3px] top-[3px] bottom-[3px] w-[40px] bg-white dark:bg-news-card rounded-full flex items-center justify-center shadow-sm">
                        <Search size={18} strokeWidth={2.5} className="text-gray-600 dark:text-news-text transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3" />
                      </div>
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto px-5">
                     <Link href="/sports" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-2 font-bold uppercase tracking-wide py-4 border-b border-gray-300 dark:border-news-border ${pathname === '/sports' || pathname.startsWith('/sports/') ? 'text-red-700 dark:text-red-500' : 'text-red-600'}`}>
                       {isSportsLive && (
                         <span className="relative flex h-2 w-2">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                         </span>
                       )}
                       खेल
                     </Link>
                     <Link href="/elections" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-2 font-bold uppercase tracking-wide py-4 border-b border-gray-300 dark:border-news-border ${pathname === '/elections' || pathname.startsWith('/elections/') ? 'text-red-700 dark:text-red-500' : 'text-red-600'}`}>
                       {isElectionLive && (
                         <span className="relative flex h-2 w-2">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                         </span>
                       )}
                       चुनाव
                     </Link>
                     <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={`block py-4 border-b border-gray-300 dark:border-news-border text-[16px] capitalize transition-colors ${pathname === '/' ? 'text-red-600 dark:text-news-accent font-bold' : 'dark:text-news-text hover:text-red-600 font-medium'}`}>होम</Link>
                     
                     <div className="border-b border-gray-300 dark:border-news-border">
                       <button onClick={() => setIsCategoriesOpen(!isCategoriesOpen)} className="w-full py-4 flex justify-between items-center font-medium text-[16px] capitalize dark:text-news-text hover:text-red-600 transition-colors">
                         श्रेणियां
                         <ChevronDown size={20} strokeWidth={1.5} className={`transition-transform duration-300 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                       </button>
                       <AnimatePresence>
                         {isCategoriesOpen && (
                           <motion.div 
                             initial={{ height: 0, opacity: 0 }}
                             animate={{ height: "auto", opacity: 1 }}
                             exit={{ height: 0, opacity: 0 }}
                             transition={{ duration: 0.2 }}
                             className="flex flex-col pb-2 overflow-hidden"
                           >
                             {navCategories.map((category, idx) => {
                               const targetPath = `/${category.slug}`;
                               const isCurrentPage = pathname === targetPath;
                               return (
                                 <Link key={category.slug} href={targetPath} onClick={() => setIsMobileMenuOpen(false)} className={`block py-4 px-2 border-b border-gray-300 dark:border-news-border hover:text-black dark:hover:text-white transition-colors ${idx === navCategories.length - 1 ? 'border-b-0' : ''} ${isCurrentPage ? 'text-red-600 dark:text-news-accent font-medium' : 'text-gray-600 dark:text-news-text-secondary'}`}>
                                   {category.name}
                                 </Link>
                               );
                             })}
                           </motion.div>
                         )}
                       </AnimatePresence>
                     </div>
                     
                     <div className="border-b border-black dark:border-news-border">
                       <button onClick={() => setIsRegionsOpen(!isRegionsOpen)} className="w-full py-4 flex justify-between items-center font-medium text-[16px] capitalize dark:text-news-text hover:text-red-600 transition-colors">
                         <span className="show-in-hi">क्षेत्र</span>
                         <span className="show-in-en" translate="no">Regions</span>
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
                               <MobileRegionItem 
                                 key={region.slug}
                                 region={region}
                                 isLast={idx === navRegions.length - 1}
                                 pathname={pathname}
                                 onClose={() => setIsMobileMenuOpen(false)}
                               />
                             ))}
                           </motion.div>
                         )}
                       </AnimatePresence>
                     </div>
                  </div>
  
                  <div className="bg-gray-200 dark:bg-news-card p-5 mt-auto flex flex-col gap-4">
                    <button onClick={() => setIsSettingsOpen(true)} className="flex items-center justify-end w-full gap-3 text-[15px] font-medium dark:text-news-text hover:text-red-600 transition-colors">
                      सेटिंग्स <Settings size={20} />
                    </button>
                    <Link href="/app" onClick={() => setIsMobileMenuOpen(false)} className="bg-red-600 text-white rounded-full py-3 flex items-center justify-center font-bold tracking-wider text-[15px] hover:bg-red-700 transition-colors capitalize">
                      ऐप डाउनलोड करें
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="settings-content"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col h-full"
                >
                  <div className="p-5 pb-6">
                    <button onClick={() => setIsSettingsOpen(false)}>
                      <X size={28} strokeWidth={2.5} />
                    </button>
                  </div>
                  <div className="px-5">
                    <h2 className="text-red-600 text-2xl font-medium border-b border-black dark:border-news-border pb-4 mb-2">सेटिंग्स</h2>
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
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Nav */}
      <nav className="hidden lg:block w-full max-w-[1400px] mx-auto px-4 mb-0 relative z-100" onMouseLeave={() => setActiveMenu(null)}>
        <div className="flex justify-between items-center text-sm font-medium">
          <div className="flex gap-6 items-center h-full">
            {visibleLinks.map((link) => {
              const targetPath = link.slug === "" ? "/" : `/${link.slug}`;
              const isCurrentPage = pathname === targetPath.toLowerCase();
              const isActiveOrHover = activeMenu === link.name || isCurrentPage;

              return (
                <div 
                  key={link.name} 
                  className="flex items-center h-full"
                  onMouseEnter={() => setActiveMenu(link.name === "Home" ? null : link.name)}
                >
                  <Link href={targetPath} className={`flex items-center h-full gap-[4px] px-1 transition-colors ${isActiveOrHover ? 'text-red-600 dark:text-news-accent' : 'hover:text-red-600 dark:hover:text-news-accent'} ${isCurrentPage ? 'font-bold' : ''}`}>
                    <span className="py-4 flex items-center">
                      <span className="relative">
                        {link.name}
                        {isCurrentPage && (
                          <motion.div 
                            layoutId="desktopNavActiveIndicator"
                            className="absolute -bottom-1 left-0 w-full h-[3px] bg-red-600 dark:bg-news-accent rounded-[2px]"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </span>
                      {link.name !== "Home" && <ChevronDown size={18} strokeWidth={1.5} className={`ml-1 transition-all duration-300 ${activeMenu === link.name ? '-rotate-180 text-red-600 dark:text-news-accent' : (isCurrentPage ? 'text-red-600 dark:text-news-accent' : 'text-gray-400')}`}/>}
                    </span>
                  </Link>
                  {link.name === "Home" && (
                    <div className="ml-8 mr-[-10px] w-px h-4 bg-gray-300 dark:bg-news-border hidden lg:block" aria-hidden="true"></div>
                  )}
                </div>
              );
            })}

            {dropdownLinks.length > 0 && (
              <div 
                className="relative cursor-pointer h-full"
                onMouseEnter={() => setActiveMenu("अधिक")}
              >
                <div className="flex items-center gap-1 hover:text-red-600 py-4">
                  अधिक <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isMoreOpen ? 'rotate-180' : ''}`}/>
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
                          {dropdownLinks.map((link, idx) => {
                            const targetPath = `/${link.slug}`;
                            const isCurrentPage = pathname === targetPath;
                            const isActiveOrHover = activeMenu === link.name || isCurrentPage;
                            
                            return (
                              <div 
                                key={`dropdown-${link.slug}-${idx}`} 
                                className="relative"
                                onMouseEnter={() => setActiveMenu(link.name)}
                              >
                                <Link href={targetPath} className={`px-6 py-3 hover:bg-gray-50 dark:hover:bg-news-bg transition-colors flex items-center justify-between group/dropdownLink ${isActiveOrHover ? 'text-red-600 dark:text-news-accent' : 'text-gray-700 dark:text-news-text'} ${isCurrentPage ? 'font-bold' : ''}`}>
                                  {link.name} <ChevronDown size={14} strokeWidth={2.5} className={`transition-all duration-300 ${activeMenu === link.name ? 'rotate-0 text-red-600 dark:text-news-accent' : (isCurrentPage ? 'text-red-600 dark:text-news-accent' : '-rotate-90 text-gray-400')}`}/>
                                </Link>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <Link href="/sports" className="group text-red-600 font-bold uppercase tracking-widest py-4 inline-block relative overflow-hidden">
              खेल
              <span className={`absolute bottom-3 left-0 w-full h-[2px] bg-red-600 transition-transform duration-300 ease-out ${pathname === '/sports' || pathname.startsWith('/sports/') ? 'translate-x-0' : '-translate-x-full group-hover:translate-x-0'}`}></span>
            </Link>
            <Link href="/elections" className="group text-red-600 font-bold uppercase tracking-widest py-4 inline-block relative overflow-hidden">
              चुनाव
              <span className={`absolute bottom-3 left-0 w-full h-[2px] bg-red-600 transition-transform duration-300 ease-out ${pathname === '/elections' || pathname.startsWith('/elections/') ? 'translate-x-0' : '-translate-x-full group-hover:translate-x-0'}`}></span>
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
