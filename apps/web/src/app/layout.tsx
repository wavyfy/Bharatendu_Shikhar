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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { regions, categories } = await fetchNavbarData();
  const { topArticles, categorySections } = await fetchHomepageData();
  const settings = await fetchSettings();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-news-bg text-news-text dark:bg-news-bg dark:text-news-text">
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          <div className="flex flex-col min-h-screen">
            <TopBar />
            <Header logoUrl={settings?.site_logo_url} />
            <Navbar categories={categorySections} topArticles={topArticles} navRegions={regions} navCategories={categories} logoUrl={settings?.site_logo_url} />
            <div className="flex-1">
              {children}
            </div>
            <Footer logoUrl={settings?.site_logo_url} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
