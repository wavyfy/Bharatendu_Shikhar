"use client";

import { useEffect, useCallback, useSyncExternalStore } from "react";
import { Languages } from "lucide-react";

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement?: new (
          options: { pageLanguage: string; includedLanguages: string; autoDisplay: boolean },
          elementId: string
        ) => void;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : "";
}

function readLang(): "en" | "hi" {
  const val = getCookie("googtrans");
  if (!val) return "en";
  const parts = val.split("/");
  return parts[parts.length - 1] === "hi" ? "hi" : "en";
}

// useSyncExternalStore: React-approved way to read external data (cookies).
// No setState in effects. Server snapshot always "en" → no hydration mismatch.
function useLang(): "en" | "hi" {
  return useSyncExternalStore(
    () => () => {}, // no subscribe needed — cookie only changes on page reload
    () => readLang(), // client snapshot
    () => "en"       // server snapshot
  );
}

export function GoogleTranslateButton() {
  const lang = useLang();

  useEffect(() => {
    // Inject hidden widget div
    if (!document.getElementById("google_translate_element")) {
      const el = document.createElement("div");
      el.id = "google_translate_element";
      el.style.display = "none";
      document.body.appendChild(el);
    }

    // Define init callback
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", includedLanguages: "hi", autoDisplay: false },
          "google_translate_element"
        );
      }
    };

    // If already loaded, init immediately
    if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit();
      return;
    }

    // Load script once
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const switchToHindi = useCallback(() => {
    document.cookie = `googtrans=/en/hi; path=/`;
    document.cookie = `googtrans=/en/hi; domain=${window.location.hostname}; path=/`;
    window.location.reload();
  }, []);

  const switchToEnglish = useCallback(() => {
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.location.hostname}; path=/`;
    window.location.reload();
  }, []);

  const toggle = lang === "en" ? switchToHindi : switchToEnglish;

  return (
    <button
      onClick={toggle}
      className="group flex items-center bg-gray-300 dark:bg-[#1A1A1A] hover:bg-gray-300 dark:hover:bg-[#2A2A2A] rounded-full px-3 py-1 text-[12px] font-bold transition-colors duration-300 text-black dark:text-news-text"
      title={lang === "en" ? "Switch to Hindi" : "Switch to English"}
    >
      <Languages size={14} className="shrink-0 transition-transform duration-500 group-hover:rotate-180" />
      
      <div 
        className={`overflow-hidden transition-all duration-500 ease-out ml-2 h-[20px] ${
          lang === "en" ? "w-[36px] group-hover:w-[110px]" : "w-[54px] group-hover:w-[130px]"
        }`}
      >
        <div className="flex flex-col transition-transform duration-500 group-hover:translate-y-[-20px]">
          <span className="whitespace-nowrap leading-[20px] transition-opacity duration-500 opacity-100 group-hover:opacity-0">
            {lang === "en" ? "हिंदी" : "English"}
          </span>
          <span className="whitespace-nowrap leading-[20px] transition-opacity duration-500 opacity-0 group-hover:opacity-100">
            {lang === "en" ? "हिंदी में बदलें" : "Switch to English"}
          </span>
        </div>
      </div>
    </button>
  );
}

// Hook for mobile settings panel
export function useTranslateToggle() {
  const lang = useLang();

  const toggle = useCallback(() => {
    if (lang === "en") {
      document.cookie = `googtrans=/en/hi; path=/`;
      document.cookie = `googtrans=/en/hi; domain=${window.location.hostname}; path=/`;
    } else {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.location.hostname}; path=/`;
    }
    window.location.reload();
  }, [lang]);

  return { lang, toggle };
}
