import { notFound } from "next/navigation";
import { fetchSettings } from "@/utils/fetchData";
import type { Metadata } from "next";
import { getSiteUrl } from "@/utils/seo";
import { LegalStandalonePage } from "@/components/shared/LegalStandalonePage";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSettings();
  const content = settings?.privacy_policy as string | null;
  const siteUrl = getSiteUrl(settings?.site_url).toString().replace(/\/$/, "");
  const siteName = settings?.site_name || "भारतेन्दु शिखर";

  if (!content || content.trim() === "") {
    return {};
  }

  const fullTitle = `गोपनीयता नीति | ${siteName}`;
  const url = `${siteUrl}/privacy`;

  return {
    title: fullTitle,
    description: `गोपनीयता नीति for ${siteName}. Read our policies and guidelines.`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description: `गोपनीयता नीति for ${siteName}. Read our policies and guidelines.`,
      url,
      siteName,
      locale: "hi_IN",
      type: "website",
    },
  };
}

export default async function PrivacyPage() {
  const settings = await fetchSettings();
  const content = settings?.privacy_policy as string | null;

  if (!content || content.trim() === "") {
    notFound();
  }

  return (
    <LegalStandalonePage field="privacy_policy" title="गोपनीयता नीति">
      <div dangerouslySetInnerHTML={{ __html: content! }} />
    </LegalStandalonePage>
  );
}
