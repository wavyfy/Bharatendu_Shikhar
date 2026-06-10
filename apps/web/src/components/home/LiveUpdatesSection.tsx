import Image from "next/image";
import { ArticleWithAuthor } from "@/utils/mapArticleData";

function getImageUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`;
}

export function LiveUpdatesSection({ article }: { article?: ArticleWithAuthor }) {
  if (!article) return null;

  const dateStr = new Date(article.published_at || article.created_at || new Date()).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <article className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
      <div className={article.featured_image ? "md:col-span-7" : "md:col-span-12"}>
        <div className="flex gap-4 items-center mb-4">
          <span className="text-red-600 font-black text-xs tracking-widest uppercase">LIVE</span>
          <span className="text-red-600 text-sm font-bold">{dateStr}</span>
        </div>
        <h3 className="font-playfair font-bold text-3xl leading-tight mb-8 pr-4">
          {article.title}
        </h3>
        <a href="#" className="text-sm text-gray-500 hover:text-black font-bold transition-colors">
          See More Updates
        </a>
      </div>
      {article.featured_image && (
        <div className="md:col-span-5">
          <div className="relative w-full aspect-video bg-gray-100">
            <Image
              src={getImageUrl(article.featured_image)!}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 30vw"
              className="object-cover"
            />
          </div>
        </div>
      )}
    </article>
  );
}
