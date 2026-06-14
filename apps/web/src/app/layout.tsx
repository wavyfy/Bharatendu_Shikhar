import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { fetchNavbarData, fetchHomepageData } from "@/utils/fetchData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { fetchSettings } from "@/utils/fetchData";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSettings();
  
  return {
    title: settings?.meta_title || "Web",
    description: settings?.meta_description || "Web App",
    icons: {
      icon: settings?.favicon_url 
        ? (settings.favicon_url.startsWith("http") ? settings.favicon_url : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${settings.favicon_url}`)
        : "/favicon.ico",
    }
  };
}

import { ThemeProvider } from "@/components/ThemeProvider";
import { SearchProvider } from "@/context/SearchContext";
import { SearchModal } from "@/components/shared/SearchModal";
import { BackToTop } from "@/components/shared/BackToTop";
import { FloatingNav } from "@/components/shared/FloatingNav";

import { MaintenanceScreen } from "@/components/shared/MaintenanceScreen";
import { MaintenanceListener } from "@/components/shared/MaintenanceListener";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await fetchSettings();

  if (settings?.maintenance_mode) {
    return (
      <MaintenanceScreen 
        settings={settings} 
        geistSansVariable={geistSans.variable} 
        geistMonoVariable={geistMono.variable} 
      />
    );
  }

  const { regions, categories } = await fetchNavbarData();
  const { topArticles, categorySections } = await fetchHomepageData();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-news-bg text-news-text dark:bg-news-bg dark:text-news-text">
        <MaintenanceListener currentMaintenanceMode={false} />
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          <SearchProvider>
            <div className="flex flex-col min-h-screen">
              <div className="flex flex-col flex-1 bg-white dark:bg-news-bg relative z-10">
                <TopBar />
                <Header logoUrl={settings?.site_logo_url} logoDarkUrl={settings?.site_logo_dark_url} />
                <Navbar categories={categorySections} topArticles={topArticles} navRegions={regions} navCategories={categories} logoUrl={settings?.site_logo_url} logoDarkUrl={settings?.site_logo_dark_url} />
                <div className="flex-1">
                  {children}
                </div>
              </div>
              <Footer 
                logoUrl={settings?.site_logo_url} 
                logoDarkUrl={settings?.site_logo_dark_url} 
                categories={categories}
                regions={regions}
                settings={settings}
              />
            </div>
            <SearchModal />
            <BackToTop />
            <FloatingNav />
          </SearchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
