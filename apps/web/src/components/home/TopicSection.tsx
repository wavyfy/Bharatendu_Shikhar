import Image from "next/image";
import { CategoryHeader } from "../shared/CategoryHeader";
import { SectionLayout } from "../shared/SectionLayout";
import { RelatedArticlesList, type RelatedArticle } from "../shared/RelatedArticlesList";

export type TopicCategoryData = {
  id: string;
  title: string;
  links: string[];
  featureArticle: {
    title: string;
    description: string;
    readTime: string;
    imageSrc: string | null;
    source: string;
  };
  splitArticles: [
    { title: string; readTime: string },
    { title: string; readTime: string }
  ];
  liveUpdate: {
    date: string;
    title: string;
    imageSrc: string | null;
  };
  relatedArticles: RelatedArticle[];
};

export function TopicSection({ data }: { data: TopicCategoryData }) {
  return (
    <SectionLayout
      leftContent={
        <>
          <CategoryHeader title={data.title} links={data.links} />
          
          <article className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-6 mt-8">
            <div className={`flex flex-col ${data.featureArticle.imageSrc ? 'md:col-span-6' : 'md:col-span-12'}`}>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold leading-[1.15] mb-6">
                {data.featureArticle.title}
              </h2>
              <p className="text-gray-600 text-[15px] leading-relaxed mb-6">
                {data.featureArticle.description}
              </p>
              <div className="mt-auto pt-4">
                <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase">
                  {data.featureArticle.readTime}
                </span>
              </div>
            </div>
            {data.featureArticle.imageSrc && (
              <div className="md:col-span-6 flex flex-col">
                <div className="relative w-full aspect-4/3 bg-gray-100 mb-2">
                  <Image
                    src={data.featureArticle.imageSrc}
                    alt={data.featureArticle.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <p className="text-right text-[9px] text-gray-400 mt-1">
                  Source : {data.featureArticle.source}
                </p>
              </div>
            )}
          </article>

          <div className="h-px w-full bg-gray-300 my-6"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            <article className="pr-8">
              <h3 className="font-playfair font-bold text-[17px] leading-tight mb-4">
                {data.splitArticles[0].title}
              </h3>
              <p className="text-[9px] text-gray-500 font-bold tracking-widest uppercase mt-4">
                {data.splitArticles[0].readTime}
              </p>
            </article>
            
            <article className="pl-8 border-l border-gray-300">
              <h3 className="font-playfair font-bold text-[17px] leading-tight mb-4">
                {data.splitArticles[1].title}
              </h3>
              <p className="text-[9px] text-gray-500 font-bold tracking-widest uppercase mt-4">
                {data.splitArticles[1].readTime}
              </p>
            </article>
          </div>

          <div className="h-px w-full bg-gray-300 my-6"></div>

          <article className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-2">
            <div className={data.liveUpdate.imageSrc ? "md:col-span-7" : "md:col-span-12"}>
              <div className="flex gap-4 items-center mb-3">
                <span className="text-red-600 font-black text-[10px] tracking-widest uppercase">LIVE</span>
                <span className="text-red-600 text-xs font-medium">{data.liveUpdate.date}</span>
              </div>
              <h3 className="font-playfair font-bold text-2xl leading-tight mb-6 pr-4">
                {data.liveUpdate.title}
              </h3>
              <a href="#" className="text-xs text-gray-500 hover:text-black font-medium transition-colors">
                See More Updates
              </a>
            </div>
            {data.liveUpdate.imageSrc && (
              <div className="md:col-span-5">
                <div className="relative w-full aspect-video bg-gray-100">
                  <Image
                    src={data.liveUpdate.imageSrc}
                    alt={data.liveUpdate.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </article>
        </>
      }
      rightContent={
        <RelatedArticlesList articles={data.relatedArticles} />
      }
    />
  );
}
