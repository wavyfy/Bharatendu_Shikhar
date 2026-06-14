"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ChevronRight } from "lucide-react";


export function Footer({ 
  logoUrl, 
  logoDarkUrl,
  categories,
  regions,
  settings
}: { 
  logoUrl?: string | null, 
  logoDarkUrl?: string | null,
  categories?: { id?: string | number; name: string; slug: string }[],
  regions?: { id?: string | number; name: string; slug: string }[],
  settings?: {
    contact_email?: string | null;
    contact_phone?: string | null;
    contact_address?: string | null;
    facebook_url?: string | null;
    twitter_url?: string | null;
    instagram_url?: string | null;
    youtube_url?: string | null;
    linkedin_url?: string | null;
    [key: string]: unknown;
  } | null
}) {
  return (
    <footer className="w-full bg-white dark:bg-news-card text-black dark:text-news-text pb-4 mt-auto">
          <div className="max-w-[1200px] mx-auto px-0">
        
        <div className="mb-10 w-full border-b-2 border-gray-200 dark:border-news-border py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-left outline-none hover:opacity-80 transition-opacity"
          >
            {logoUrl || logoDarkUrl ? (
              <>
                {logoUrl && (
                  <div className={logoDarkUrl ? "dark:hidden" : ""}>
                    <Image 
                      src={logoUrl.startsWith("http") ? logoUrl : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${logoUrl}`} 
                      alt="Bharatendu Shikhar Logo" 
                      width={240} 
                      height={60} 
                      className="w-auto h-[60px] object-contain object-left"
                      style={{ width: "auto" }}
                    />
                  </div>
                )}
                {logoDarkUrl && (
                  <div className={logoUrl ? "hidden dark:block" : ""}>
                    <Image 
                      src={logoDarkUrl.startsWith("http") ? logoDarkUrl : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${logoDarkUrl}`} 
                      alt="Bharatendu Shikhar Logo (Dark)" 
                      width={240} 
                      height={60} 
                      className="w-auto h-[60px] object-contain object-left"
                      style={{ width: "auto" }}
                    />
                  </div>
                )}
              </>
            ) : (
              <h2 className="text-3xl font-black uppercase tracking-tighter">BHARATENDU <span className="text-red-600">SHIKHAR</span></h2>
            )}
          </button>
          
      
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 lg:gap-16">
          
          {/* Main Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
            
            {/* Categories */}
            {categories && categories.length > 0 && (
              <div className="flex flex-col gap-4 md:border-r-2 border-gray-200 dark:border-news-border md:pr-8">
                <h3 className="font-bold text-[16px] uppercase tracking-wider mb-2 flex items-center gap-2">

                  Categories
                </h3>
                <div className="flex flex-col gap-3">
                  {categories.map((cat) => (
                    <Link key={cat.id} href={`/${cat.slug}`} className="group flex items-center text-[14px] text-gray-600 dark:text-news-text-secondary hover:text-red-600 dark:hover:text-red-500 transition-all capitalize">
                      <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-red-600 mr-1" />
                      <span className="group-hover:translate-x-1 transition-transform">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Regions */}
            {regions && regions.length > 0 && (
              <div className="flex flex-col gap-4 md:border-r-2 border-gray-200 dark:border-news-border md:pr-8">
                <h3 className="font-bold text-[16px] uppercase tracking-wider mb-2 flex items-center gap-2">

                  Regions
                </h3>
                <div className="flex flex-col gap-3">
                  {regions.map((reg) => (
                    <Link key={reg.id} href={`/${reg.slug}`} className="group flex items-center text-[14px] text-gray-600 dark:text-news-text-secondary hover:text-red-600 dark:hover:text-red-500 transition-all capitalize">
                      <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-red-600 mr-1" />
                      <span className="group-hover:translate-x-1 transition-transform">{reg.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Links */}
            <div className="flex flex-col gap-4 md:pl-2">
              <h3 className="font-bold text-[16px] uppercase tracking-wider mb-2 flex items-center gap-2">
                Quick Links
              </h3>
              <div className="flex flex-col gap-3">
                <Link href="/" className="group flex items-center text-[14px] text-gray-600 dark:text-news-text-secondary hover:text-red-600 dark:hover:text-red-500 transition-all">
                  <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-red-600 mr-1" />
                  <span className="group-hover:translate-x-1 transition-transform">Home Page</span>
                </Link>
                <Link href="/epaper" className="group flex items-center text-[14px] text-gray-600 dark:text-news-text-secondary hover:text-red-600 dark:hover:text-red-500 transition-all">
                  <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-red-600 mr-1" />
                  <span className="group-hover:translate-x-1 transition-transform">Read ePaper</span>
                </Link>
              </div>
            </div>
            
          </div>

          {/* Right Sidebar - Account & Follow Us */}
          <div className="flex flex-col lg:border-l-2 border-gray-200 dark:border-news-border lg:pl-10">
            
            {/* Contact */}
            <div className="mb-10">
              <h3 className="font-bold text-[16px] uppercase tracking-wider mb-5 flex items-center gap-2">
                Contact Us
              </h3>
              <div className="flex flex-col gap-4 text-[14px] text-gray-600 dark:text-news-text-secondary">
                {settings?.contact_email && (
                  <div className="flex items-start gap-3 group">
                    <Mail size={18} className="mt-0.5 text-gray-400 group-hover:text-red-600 transition-colors shrink-0" />
                    <span className="group-hover:text-black dark:group-hover:text-white transition-colors">{settings.contact_email}</span>
                  </div>
                )}
                {settings?.contact_phone && (
                  <div className="flex items-start gap-3 group">
                    <Phone size={18} className="mt-0.5 text-gray-400 group-hover:text-red-600 transition-colors shrink-0" />
                    <span className="group-hover:text-black dark:group-hover:text-white transition-colors">{settings.contact_phone}</span>
                  </div>
                )}
                {settings?.contact_address && (
                  <div className="flex items-start gap-3 group">
                    <MapPin size={18} className="mt-0.5 text-gray-400 group-hover:text-red-600 transition-colors shrink-0" />
                    <span className="group-hover:text-black dark:group-hover:text-white transition-colors leading-relaxed">{settings.contact_address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Follow Us */}
            <div>
              <h3 className="font-bold text-[16px] uppercase tracking-wider mb-5 flex items-center gap-2">
                Follow Us
              </h3>
              <div className="flex flex-wrap gap-3">
                {settings?.facebook_url && (
                  <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-news-border flex items-center justify-center text-gray-600 dark:text-news-text-muted hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </a>
                )}
                {settings?.twitter_url && (
                  <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-news-border flex items-center justify-center text-gray-600 dark:text-news-text-muted hover:bg-black dark:hover:bg-gray-800 hover:text-white transition-all transform hover:-translate-y-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>
                  </a>
                )}
                {settings?.instagram_url && (
                  <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-news-border flex items-center justify-center text-gray-600 dark:text-news-text-muted hover:bg-pink-600 hover:text-white transition-all transform hover:-translate-y-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                )}
                {settings?.youtube_url && (
                  <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-news-border flex items-center justify-center text-gray-600 dark:text-news-text-muted hover:bg-red-600 hover:text-white transition-all transform hover:-translate-y-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
                  </a>
                )}
                {settings?.linkedin_url && (
                  <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-news-border flex items-center justify-center text-gray-600 dark:text-news-text-muted hover:bg-blue-700 hover:text-white transition-all transform hover:-translate-y-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Border */}
        <div className="h-[2px] w-full bg-gray-200 dark:bg-news-border my-10"></div>

        {/* Bottom Content */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 w-full">
          {/* Copyright & T&C */}
          <div className="text-[13px] text-gray-500 dark:text-news-text-muted flex flex-wrap lg:flex-nowrap justify-center lg:justify-start gap-3 md:gap-4 items-center whitespace-nowrap">
            <span className="font-medium">&copy; {new Date().getFullYear()} Bharatendu Shikhar. All rights reserved.</span>
            <span className="hidden md:inline text-gray-300 dark:text-news-border">|</span>
            <Link href="/terms" className="hover:text-red-600 transition-colors font-medium">Terms & Conditions</Link>
            <span className="hidden md:inline text-gray-300 dark:text-news-border">|</span>
            <Link href="/privacy" className="hover:text-red-600 transition-colors font-medium">Privacy Policy</Link>
          </div>

          {/* Bottom Buttons */}
          <div className="flex flex-row justify-end items-center gap-3 w-full lg:w-auto">
            <Link href="/epaper" className="border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full px-6 py-2 text-sm font-bold transition-colors flex items-center justify-center flex-1 lg:flex-none">
              Read ePaper
            </Link>
            <Link href="/app" className="bg-red-600 text-white hover:bg-red-700 rounded-full px-6 py-2 text-sm font-bold transition-colors flex items-center justify-center flex-1 lg:flex-none">
              Get the App
            </Link>
          </div>
        </div>

          </div>
    </footer>
  );
}
