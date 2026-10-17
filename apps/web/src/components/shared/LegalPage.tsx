import { notFound } from "next/navigation";
import { fetchSettings } from "@/utils/fetchData";
import type { Metadata } from "next";
import { getSiteUrl } from "@/utils/seo";
import { LegalStandalonePage } from "./LegalStandalonePage";

export async function LegalPage({ field, title }: { field: string, title: string }) {
  const settings = await fetchSettings();
  const content = settings?.[field as keyof typeof settings] as string | null;

  if (!content || content.trim() === "") {
    notFound();
  }

  return (
    <LegalStandalonePage field={field} title={title}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </LegalStandalonePage>
  );
}

export async function generateLegalMetadata(field: string, title: string, slug: string): Promise<Metadata> {
  const settings = await fetchSettings();
  const content = settings?.[field as keyof typeof settings] as string | null;
  const siteUrl = getSiteUrl(settings?.site_url).toString().replace(/\/$/, "");
  const siteName = settings?.site_name || "भारतेन्दु शिखर";

  if (!content || content.trim() === "") {
    return {};
  }

  const fullTitle = `${title} | ${siteName}`;
  const url = `${siteUrl}/${slug}`;

  return {
    title: fullTitle,
    description: `${title} for ${siteName}. Read our policies and guidelines.`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description: `${title} for ${siteName}. Read our policies and guidelines.`,
      url: url,
      siteName,
      locale: "hi_IN",
      type: "website",
    },
  };
}
