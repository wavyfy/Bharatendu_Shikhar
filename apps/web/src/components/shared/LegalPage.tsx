import { notFound } from "next/navigation";
import { fetchSettings } from "@/utils/fetchData";
import type { Metadata } from "next";
import { getSiteUrl } from "@/utils/seo";
import { LegalDialog } from "./LegalDialog";

export async function LegalPage({ field, title }: { field: string, title: string }) {
  const settings = await fetchSettings();
  const content = settings?.[field as keyof typeof settings] as string | null;

  if (!content || content.trim() === "") {
    notFound();
  }

  return (
    <LegalDialog field={field} title={title}>
      <article className="prose prose-lg dark:prose-invert max-w-none prose-a:text-red-600 hover:prose-a:text-red-700 prose-a:transition-colors prose-a:font-medium prose-headings:tracking-tight marker:text-red-600 prose-li:my-1">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </article>
    </LegalDialog>
  );
}

export async function generateLegalMetadata(field: string, title: string, slug: string): Promise<Metadata> {
  const settings = await fetchSettings();
  const content = settings?.[field as keyof typeof settings] as string | null;
  const siteUrl = getSiteUrl(settings?.site_url).toString().replace(/\/$/, "");
  const siteName = settings?.site_name || "Bharatendu Shikhar";

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
      locale: "en_US",
      type: "website",
    },
  };
}
