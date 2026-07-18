"use client";

import { CurrentDate } from "./CurrentDate";

import Image from "next/image";
import Link from "next/link";
import { SearchButton } from "../shared/SearchButton";

export function Header({ logoUrl, logoDarkUrl }: { logoUrl?: string | null, logoDarkUrl?: string | null }) {
  return (
    <header className="hidden lg:block pb-2 px-4 w-full max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center">
        <div className="w-48 text-sm text-gray-700 dark:text-news-text-secondary space-y-1">
          <p><CurrentDate /></p>
          <p>
            <span className="show-in-hi">आज का अखबार</span>
            <span className="show-in-en" translate="no">Today&apos;s Newspaper</span>
          </p>
        </div>
        
        <div className="flex items-center">
          <Link href="/" onClick={(e) => {
            if (window.location.pathname === '/') {
              e.preventDefault();
              window.location.reload();
            }
          }} className="block">
            {logoUrl || logoDarkUrl ? (
              <>
                {logoUrl && (
                  <div className={logoDarkUrl ? "dark:hidden" : ""}>
                    <Image 
                      src={logoUrl.startsWith("http") ? logoUrl : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${logoUrl}`} 
                      alt="Bharatendu Shikhar Logo" 
                      width={550} 
                      height={100} 
                      className="w-auto h-[100px] object-contain object-left"
                      style={{ width: "auto" }}
                      priority
                    />
                  </div>
                )}
                {logoDarkUrl && (
                  <div className={logoUrl ? "hidden dark:block" : ""}>
                    <Image 
                      src={logoDarkUrl.startsWith("http") ? logoDarkUrl : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${logoDarkUrl}`} 
                      alt="Bharatendu Shikhar Logo (Dark)" 
                      width={550} 
                      height={100} 
                      className="w-auto h-[100px] object-contain object-left"
                      style={{ width: "auto" }}
                      priority
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-6">
                <h1 className="text-5xl md:text-6xl font-medium tracking-tight">
                  Bharatendu Shikhar
                </h1>
              </div>
            )}
          </Link>
        </div>

        <div className="w-64 flex justify-end items-center gap-6">
          <SearchButton />
        </div>
      </div>
    </header>
  );
}
