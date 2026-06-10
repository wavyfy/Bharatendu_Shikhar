import Image from "next/image";
import { ArticleWithAuthor } from "@/utils/mapArticleData";

function calculateReadTime(content: string): string {
  if (!content) return "1 MIN READ";
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} MIN READ`;
}

function getImageUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`;
}

export function FeatureArticle({ article }: { article?: ArticleWithAuthor }) {
  if (!article) return null;

  return (
    <article className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-6 mt-4">
      <div className={`flex flex-col ${article.featured_image ? 'md:col-span-6' : 'md:col-span-12'}`}>
        <h2 className="font-playfair text-3xl md:text-5xl font-bold leading-[1.15] mb-6">
          {article.title}
        </h2>
        <p className="text-gray-600 text-[15px] leading-relaxed mb-6">
          {article.excerpt || article.content.substring(0, 150) + "..."}
        </p>
        <div className="mt-auto pt-4">
          <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase">
            {calculateReadTime(article.content)}
          </span>
        </div>
      </div>
      {article.featured_image && (
        <div className="md:col-span-6 flex flex-col">
          <div className="relative w-full aspect-4/3 bg-gray-100 mb-2">
            <Image
              src={getImageUrl(article.featured_image)}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <p className="text-right text-[9px] text-gray-400 mt-1">
            Source : {article.profiles?.full_name || "Editorial Team"}
          </p>
        </div>
      )}
    </article>
  );
}
