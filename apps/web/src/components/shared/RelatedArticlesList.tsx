import Image from "next/image";

export type RelatedArticle = {
  id: string | number;
  source: string;
  title: string;
  readTime: string;
  imageSrc?: string | null;
};

export function RelatedArticlesList({ articles }: { articles: RelatedArticle[] }) {
  return (
    <div className="flex flex-col gap-6 pt-2">
      {articles.map((article, index) => (
        <div key={article.id}>
          <article className="flex gap-4 items-start">
            <div className="flex-1 pr-2">
              <p className="text-[9px] text-red-600 font-bold mb-3 tracking-wide">
                {article.source}
              </p>
              <h4 className="font-playfair font-bold text-xl leading-tight mb-4">
                {article.title}
              </h4>
              <p className="text-[9px] text-gray-500 font-bold tracking-widest uppercase mt-4">
                {article.readTime}
              </p>
            </div>
            {article.imageSrc && (
              <div className="w-[120px] shrink-0">
                <div className="relative w-full aspect-4/3 bg-gray-100">
                  <Image
                    src={article.imageSrc}
                    alt={article.title}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </article>
          {index < articles.length - 1 && (
            <div className="h-px w-full bg-gray-300 my-6"></div>
          )}
        </div>
      ))}
    </div>
  );
}
