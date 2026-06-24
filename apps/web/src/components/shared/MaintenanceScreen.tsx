import { ThemeProvider } from "@/components/ThemeProvider";
import { CommonListener } from "@/components/shared/CommonListener";

export function MaintenanceScreen({
  settings,
  geistSansVariable,
  geistMonoVariable,
}: {
  settings: {
    site_logo_url?: string | null;
    site_logo_dark_url?: string | null;
    maintenance_message?: string | null;
    hide_all_ads?: boolean | null;
    [key: string]: unknown;
  } | null;
  geistSansVariable: string;
  geistMonoVariable: string;
}) {
  if (!settings) return null;

  return (
    <html
      lang="hi"
      suppressHydrationWarning
      className={`${geistSansVariable} ${geistMonoVariable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#FAFAFA] dark:bg-[#050505] text-[#111] dark:text-[#EAEAEA] flex flex-col items-center justify-center relative selection:bg-red-600/20 overflow-hidden texture-bg">
        <CommonListener currentMaintenanceMode={true} currentHideAllAds={settings?.hide_all_ads ?? false} />
        <style>{`
          @keyframes gentle-breathe {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.02); opacity: 0.95; }
          }
          .animate-breathe {
            animation: gentle-breathe 6s ease-in-out infinite;
          }
          .delay-150 { animation-delay: 150ms; }
          .delay-300 { animation-delay: 300ms; }
          
          .texture-bg {
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.06'/%3E%3C/svg%3E");
          }
          .dark .texture-bg {
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
          }
        `}</style>
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          
          <div className="relative z-10 w-full max-w-[600px] p-6 mx-auto animate-in fade-in duration-1000 ease-out fill-mode-both flex flex-col items-center text-center">
            
            {/* Logo Section */}
            <div className="relative flex justify-center mb-14 animate-breathe">
              {/* Radial Glow */}
              <div className="absolute inset-0 w-[140%] h-[140%] left-[-20%] top-[-20%] bg-white/60 dark:bg-red-900/10 blur-3xl rounded-full pointer-events-none z-0 mix-blend-screen dark:mix-blend-lighten"></div>
              
              <div className="relative z-10">
                {settings?.site_logo_url || settings?.site_logo_dark_url ? (
                  <>
                    {settings?.site_logo_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={settings.site_logo_url.startsWith("http") ? settings.site_logo_url : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${settings.site_logo_url}`}
                        alt="Bharatendu Shikhar Logo"
                        className={`h-20 sm:h-24 object-contain ${settings?.site_logo_dark_url ? 'dark:hidden' : ''}`}
                      />
                    )}
                    {settings?.site_logo_dark_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={settings.site_logo_dark_url.startsWith("http") ? settings.site_logo_dark_url : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${settings.site_logo_dark_url}`}
                        alt="Bharatendu Shikhar Logo (Dark)"
                        className={`h-20 sm:h-24 object-contain ${settings?.site_logo_url ? 'hidden dark:block' : ''}`}
                      />
                    )}
                  </>
                ) : (
                  <h2 className="text-4xl font-medium tracking-tight text-black dark:text-white font-serif">BHARATENDU SHIKHAR</h2>
                )}
              </div>
            </div>

            {/* Content Section */}
            <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-black dark:text-white mb-6">
              Website Under Maintenance
            </h1>
            
            <div className="space-y-4 mb-10 px-4">
              <p className="text-[18px] sm:text-[20px] leading-relaxed text-gray-800 dark:text-gray-200">
                {settings.maintenance_message || "We are performing scheduled updates to improve the Bharatendu Shikhar experience."}
              </p>
            </div>

            {/* Editorial Separator */}
            <div className="w-full flex justify-center my-8">
              <div className="h-px w-full max-w-[200px] bg-linear-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
            </div>

            {/* Status Section */}
            <div className="flex flex-col items-center justify-center space-y-6">
              <span className="text-[14px] font-semibold tracking-widest text-red-700 dark:text-red-500 uppercase">
                Expected Return Soon
              </span>
              
              <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400 max-w-[400px]">
                Our editorial and technical teams are working to bring the platform back online.
              </p>

              {/* Minimal Loading Indicator */}
              <div className="flex justify-center items-center gap-2 pt-4">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-600 animate-pulse"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-600 animate-pulse delay-150"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-600 animate-pulse delay-300"></div>
              </div>
            </div>

            {/* Footer Area */}
            <div className="mt-20 text-center text-xs font-semibold text-gray-400 dark:text-gray-600 tracking-[0.2em] uppercase">
              &copy; {new Date().getFullYear()} Bharatendu Shikhar
            </div>
            
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
