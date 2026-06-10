import { ArticleWithAuthor } from "@/utils/mapArticleData";

function calculateReadTime(content: string): string {
  if (!content) return "1 MIN READ";
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} MIN READ`;
}

export function SplitArticles({ articles }: { articles: ArticleWithAuthor[] }) {
  const leftArticle = articles[0];
  const rightArticle = articles[1];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
      <article className="pr-8">
        <h3 className="font-playfair font-bold text-xl leading-tight mb-4">
          {leftArticle ? leftArticle.title : "More News Coming Soon"}
        </h3>
        <p className="text-[9px] text-gray-500 font-bold tracking-widest uppercase mt-6">
          {leftArticle ? calculateReadTime(leftArticle.content) : ""}
        </p>
      </article>
      
      <article className="pl-8 border-l border-gray-300">
        <h3 className="font-playfair font-bold text-xl leading-tight mb-4">
          {rightArticle ? rightArticle.title : "More News Coming Soon"}
        </h3>
        <p className="text-[9px] text-gray-500 font-bold tracking-widest uppercase mt-6">
          {rightArticle ? calculateReadTime(rightArticle.content) : ""}
        </p>
      </article>
    </div>
  );
}
