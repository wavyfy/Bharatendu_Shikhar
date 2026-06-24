import Link from "next/link";

export function CategoryHeader({ title, slug, links }: { title: string, slug?: string, links: string[] }) {
  return (
    <div className="flex items-end flex-wrap gap-x-8 gap-y-4 mb-6 border-b-2 border-gray-300 dark:border-news-border pb-2">
      {slug ? (
        <Link href={`/${slug}`} className="hover:text-red-600 dark:hover:text-news-accent transition-colors">
          <h2 className="font-bold text-[24px] text-inherit">{title}</h2>
        </Link>
      ) : (
        <h2 className="font-bold text-[24px] text-black dark:text-news-text">{title}</h2>
      )}
      <div className="flex flex-wrap gap-6 text-[13px] font-medium text-gray-700 dark:text-news-text-secondary">
        {links.map((link) => (
          <a href="#" key={link} className="hover:text-red-600 dark:hover:text-news-accent transition-colors">
            {link}
          </a>
        ))}
      </div>
    </div>
  );
}
