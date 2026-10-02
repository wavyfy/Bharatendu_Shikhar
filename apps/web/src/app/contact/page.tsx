import { notFound } from "next/navigation";
import { fetchSettings } from "@/utils/fetchData";
import type { Metadata } from "next";
import { getSiteUrl } from "@/utils/seo";
import { LegalDialog } from "@/components/shared/LegalDialog";
import Home from "@/app/page";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSettings();
  const hasContactInfo = settings?.contact_email || settings?.contact_phone || settings?.contact_address;
  const siteUrl = getSiteUrl(settings?.site_url).toString().replace(/\/$/, "");
  const siteName = settings?.site_name || "भारतेन्दु शिखर";

  if (!hasContactInfo) return {};

  const fullTitle = `संपर्क करें | ${siteName}`;
  const description = `${siteName} से संपर्क करें। ई-मेल, फोन या कार्यालय के माध्यम से हमसे जुड़ें।`;
  const url = `${siteUrl}/contact`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: url,
      siteName,
      locale: "hi_IN",
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
    <>
      <Home />
      <LegalDialog field="contact" title="संपर्क करें">
        <div className="flex flex-col divide-y divide-gray-200 dark:divide-news-border">
          {settings.contact_email && (
            <div className="py-4.5 px-2 transition-all duration-200">
              <h3 className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1.5">ई-मेल</h3>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {settings.contact_email}
              </p>
            </div>
          )}
          
          {settings.contact_phone && (
            <div className="py-4.5 px-2 transition-all duration-200">
              <h3 className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1.5">फोन</h3>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {settings.contact_phone}
              </p>
            </div>
          )}
          
          {settings.contact_address && (
            <div className="py-4.5 px-2 transition-all duration-200">
              <h3 className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1.5">कार्यालय का पता</h3>
              <p className="text-lg font-medium text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
                {settings.contact_address}
              </p>
            </div>
          )}
        </div>
      </LegalDialog>
    </>
  );
}
