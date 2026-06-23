import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  siteUrl: string;
}

/**
 * Renders a breadcrumb navigation UI and injects corresponding JSON-LD structured data.
 *
 * @param siteUrl - The base URL used to construct absolute URLs in the JSON-LD schema
 */
export function Breadcrumbs({ items, siteUrl }: BreadcrumbsProps) {
  const schemaList = items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.label,
    item: item.href ? `${siteUrl}${item.href}` : undefined,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: schemaList,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="hidden md:block mb-4 text-sm text-slate-500">
        <ol className="flex items-center space-x-2">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={index} className="flex items-center">
                {index === 0 && <Home className="h-4 w-4 mr-1.5" />}
                {index > 0 && <ChevronRight className="h-4 w-4 mx-1.5 text-slate-400" />}
                {isLast || !item.href ? (
                  <span className="font-medium text-slate-800 dark:text-slate-200" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-primary transition-colors hover:underline"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
