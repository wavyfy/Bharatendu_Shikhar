import type { Metadata } from "next";
import { Inter, Geist_Mono, Newsreader, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { fetchNavbarData, fetchHomepageData } from "@/utils/fetchData";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

const devanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
});

import { fetchSettings } from "@/utils/fetchData";

import { getSiteUrl } from "@/utils/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSettings();
  const siteUrl = getSiteUrl(settings?.site_url);
  const siteName = settings?.site_name || "Bharatendu Shikhar";
  const title = settings?.meta_title || siteName;
  const description = settings?.meta_description || "Latest News and Updates";
  const ogImageUrl = settings?.og_image_url || "/default-og.jpg";
  
  const iconUrl = settings?.favicon_url 
    ? (settings.favicon_url.startsWith("http") ? settings.favicon_url : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${settings.favicon_url}`)
    : "/favicon.ico";

  return {
    metadataBase: siteUrl,
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    alternates: {
      types: {
        "application/rss+xml": [
          { url: "/rss.xml", title: `${siteName} RSS Feed` },
        ],
      },
    },
    openGraph: {
      title,
      description,
      url: siteUrl.toString(),
      siteName,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
      locale: "hi_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
    icons: {
      icon: iconUrl,
    }
  };
}

import { ThemeProvider } from "@/components/ThemeProvider";
import { SearchProvider } from "@/context/SearchContext";
import { SearchModal } from "@/components/shared/SearchModal";
import { BackToTop } from "@/components/shared/BackToTop";
import { FloatingNav } from "@/components/shared/FloatingNav";

import { MaintenanceScreen } from "@/components/shared/MaintenanceScreen";
import { CommonListener } from "@/components/shared/CommonListener";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, { regions, categories }, { topArticles, categorySections }] = await Promise.all([
    fetchSettings(),
    fetchNavbarData(),
    fetchHomepageData(),
  ]);

  if (settings?.maintenance_mode) {
    return (
      <MaintenanceScreen
        settings={settings}
        geistSansVariable={inter.variable}
        geistMonoVariable={geistMono.variable}
      />
    );
  }

  return (
    <html
      lang="hi"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} ${newsreader.variable} ${devanagari.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-news-bg text-news-text dark:bg-news-bg dark:text-news-text">
        <CommonListener 
          currentMaintenanceMode={false} 
          currentHideAllAds={settings?.hide_all_ads ?? false}
        />
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
