import { notFound } from "next/navigation";
import { fetchSettings } from "@/utils/fetchData";
import type { Metadata } from "next";
import { getSiteUrl } from "@/utils/seo";
import { LegalDialog } from "@/components/shared/LegalDialog";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSettings();
  const hasContactInfo = settings?.contact_email || settings?.contact_phone || settings?.contact_address;
  const siteUrl = getSiteUrl(settings?.site_url).toString().replace(/\/$/, "");
  const siteName = settings?.site_name || "Bharatendu Shikhar";

  if (!hasContactInfo) return {};

  const fullTitle = `Contact Us | ${siteName}`;
  const url = `${siteUrl}/contact`;

  return {
    title: fullTitle,
    description: `Contact ${siteName}. Reach out to us via email, phone, or visit our office.`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description: `Contact ${siteName}. Reach out to us via email, phone, or visit our office.`,
      url: url,
      siteName,
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function ContactPage() {
  const settings = await fetchSettings();
  const hasContactInfo = settings?.contact_email || settings?.contact_phone || settings?.contact_address;

  if (!hasContactInfo) {
    notFound();
  }

  return (
    <LegalDialog field="contact" title="Contact Us">
      <div className="space-y-8">
        {settings.contact_email && (
          <div className="group transition-all duration-300 p-6 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-news-border hover:bg-gray-50 dark:hover:bg-news-card hover:shadow-sm">
            <h3 className="text-sm font-bold text-red-600 uppercase tracking-widest mb-2">Email Us</h3>
            <p className="text-xl font-medium text-gray-900 dark:text-white">
              <a href={`mailto:${settings.contact_email}`} className="hover:text-red-600 transition-colors inline-block transform hover:translate-x-1 duration-200">
                {settings.contact_email}
              </a>
            </p>
          </div>
        )}
        
        {settings.contact_phone && (
          <div className="group transition-all duration-300 p-6 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-news-border hover:bg-gray-50 dark:hover:bg-news-card hover:shadow-sm">
            <h3 className="text-sm font-bold text-red-600 uppercase tracking-widest mb-2">Call Us</h3>
            <p className="text-xl font-medium text-gray-900 dark:text-white">
              <a href={`tel:${settings.contact_phone}`} className="hover:text-red-600 transition-colors inline-block transform hover:translate-x-1 duration-200">
                {settings.contact_phone}
              </a>
            </p>
          </div>
        )}
        
        {settings.contact_address && (
          <div className="group transition-all duration-300 p-6 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-news-border hover:bg-gray-50 dark:hover:bg-news-card hover:shadow-sm">
            <h3 className="text-sm font-bold text-red-600 uppercase tracking-widest mb-2">Visit Us</h3>
            <p className="text-xl font-medium text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
              {settings.contact_address}
            </p>
          </div>
        )}
      </div>
    </LegalDialog>
  );
}
