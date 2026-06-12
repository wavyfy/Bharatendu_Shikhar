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

export const metadata: Metadata = {
  title: "Web",
  description: "Web App",
};

import { ThemeProvider } from "@/components/ThemeProvider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { regions, categories } = await fetchNavbarData();
  const { topArticles, categorySections } = await fetchHomepageData();

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
            <Header />
            <Navbar categories={categorySections} topArticles={topArticles} navRegions={regions} navCategories={categories} />
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
