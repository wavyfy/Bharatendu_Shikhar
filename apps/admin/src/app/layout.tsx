import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["600", "700"],
});

import { supabaseAdmin } from "@repo/api";

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await supabaseAdmin.from("settings").select("meta_title, meta_description, favicon_url").eq("id", 1).single();
  
  return {
    title: settings?.meta_title || "Bharatendu Shikhar Admin",
    description: settings?.meta_description || "CMS Portal",
    icons: {
      icon: settings?.favicon_url 
        ? (settings.favicon_url.startsWith("http") ? settings.favicon_url : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${settings.favicon_url}`)
        : "/favicon.ico",
    }
  };
}

import { ToastProvider } from "@/components/ui/Toast";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import NextTopLoader from "nextjs-toploader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${inter.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <NextTopLoader color="#0058c3" showSpinner={false} />
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
