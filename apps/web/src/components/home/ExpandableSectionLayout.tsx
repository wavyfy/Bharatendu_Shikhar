"use client";

import { useState } from "react";
import { FeatureArticle } from "./FeatureArticle";
import { SplitArticles } from "./SplitArticles";
import { LiveUpdatesSection } from "./LiveUpdatesSection";
import { RelatedArticlesList } from "../shared/RelatedArticlesList";
import type { ArticleWithAuthor } from "@/utils/mapArticleData";

export function ExpandableSectionLayout({ 
  articles, 
  headerNode 
}: { 
  articles: ArticleWithAuthor[], 
  headerNode?: React.ReactNode 
}) {
  const [visibleChunks, setVisibleChunks] = useState(1);
  const CHUNK_SIZE = 8;
  const totalChunks = Math.ceil(articles.length / CHUNK_SIZE);
  
  const handleLoadMore = () => {
    setVisibleChunks(prev => Math.min(prev + 1, totalChunks));
  };

  const handleLoadLess = () => {
    setVisibleChunks(prev => Math.max(prev - 1, 1));
  };

  if (!articles || articles.length === 0) return null;

  return (
    <div className="flex flex-col w-full mb-12">
      {Array.from({ length: totalChunks }).map((_, i) => {
        const chunk = articles.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
        if (chunk.length === 0) return null;
        
        const isVisible = i < visibleChunks;
        
        const leftCount = Math.max(Math.min(chunk.length, 4), chunk.length - 4);
        const leftArticles = chunk.slice(0, leftCount);
        
        const rightArticles = chunk.slice(leftCount);
        
        return (
          <div 
            key={i}
            className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isVisible ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
          >
            <div className="overflow-hidden">
              {i > 0 && <div className="h-[2px] w-full bg-gray-300 dark:bg-news-border my-8"></div>}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                <div className="lg:col-span-8 lg:pr-4">
                  {i === 0 && headerNode && (
                    <>{headerNode}</>
                  )}

                  {leftArticles[0] && (
                    <>
                      <FeatureArticle article={leftArticles[0]} />
                      {(leftArticles[1] || leftArticles[2] || leftArticles[3]) && <div className="h-[2px] w-full bg-gray-300 dark:bg-news-border my-8"></div>}
                    </>
                  )}
                  
                  {(leftArticles[1] || leftArticles[2]) && (
                    <>
                      <SplitArticles articles={leftArticles.slice(1, 3)} />
                      {leftArticles[3] && <div className="h-[2px] w-full bg-gray-300 dark:bg-news-border my-8"></div>}
                    </>
                  )}
                  
                  {leftArticles[3] && (
                    <LiveUpdatesSection article={leftArticles[3]} />
                  )}
                </div>

                <div className="lg:col-span-4 lg:pl-4 border-t-2 lg:border-t-0 lg:border-l-2 border-gray-300 dark:border-news-border mt-8 pt-8 lg:mt-0 lg:pt-0">
                  <RelatedArticlesList articles={rightArticles} />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {(totalChunks > 1) && (
        <div className="flex justify-center mt-8 mb-4 border-t-2 border-gray-300 dark:border-news-border pt-8 relative">
          <div className="absolute -top-px left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-news-bg px-4 flex gap-4">
            {visibleChunks > 1 && (
              <button 
                onClick={handleLoadLess}
                className="px-6 py-2 border-2 border-gray-400 dark:border-news-text-muted text-gray-600 dark:text-news-text-muted font-bold uppercase tracking-wider text-sm hover:bg-gray-100 dark:hover:bg-news-card transition-colors"
              >
                Load Less
              </button>
            )}
            {visibleChunks < totalChunks && (
              <button 
                onClick={handleLoadMore}
                className="px-6 py-2 border-2 border-black dark:border-news-border text-black dark:text-news-text font-bold uppercase tracking-wider text-sm hover:bg-black dark:hover:bg-news-card hover:text-white dark:hover:text-news-accent transition-colors"
              >
                Load More
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
