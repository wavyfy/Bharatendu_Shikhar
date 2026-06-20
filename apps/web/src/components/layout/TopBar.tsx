"use client";

import Link from "next/link";
import { GoogleTranslateButton } from "./GoogleTranslate";
import { ThemeToggle } from "./ThemeToggle";

export function TopBar() {
  return (
    <div className="hidden lg:block pt-2 px-4 w-full max-w-[1400px] mx-auto text-sm">
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <GoogleTranslateButton />
          <ThemeToggle />
        </div>
        <div className="flex gap-3">
          <Link href="/epaper" className="border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors leading-none h-8 flex items-center justify-center">
            Read ePaper
          </Link>
          <button className="bg-red-600 text-white hover:bg-red-700 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors h-8 flex items-center justify-center">
            Get the App
          </button>
        </div>
      </div>
    </div>
  );
}
