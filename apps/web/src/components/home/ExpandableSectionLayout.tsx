"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FeatureArticle } from "./FeatureArticle";
import { SplitArticles } from "./SplitArticles";
import { SecondaryFeatureArticle } from "./SecondaryFeatureArticle";
import { RelatedArticlesList } from "../shared/RelatedArticlesList";
import type { ArticleWithAuthor } from "@/utils/mapArticleData";

export function ExpandableSectionLayout({ 
  articles, 
  headerNode,
  initialVisibleChunks = 3
}: { 
  articles: ArticleWithAuthor[], 
  headerNode?: React.ReactNode,
  initialVisibleChunks?: number
}) {
  const [visibleChunks, setVisibleChunks] = useState(initialVisibleChunks);
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
    <div className="flex flex-col w-full mb-0">
      {Array.from({ length: totalChunks }).map((_, i) => {
        const chunk = articles.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
        if (chunk.length === 0) return null;
        
        const isVisible = i < visibleChunks;
        
        const leftCount = Math.max(Math.min(chunk.length, 4), chunk.length - 4);
        const leftArticles = chunk.slice(0, leftCount);
        
        const rightArticles = chunk.slice(leftCount);
        
        return (
          <AnimatePresence key={i} initial={false}>
            {isVisible && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                {i > 0 && <div className="h-[2px] w-full bg-gray-300 dark:bg-news-border my-6"></div>}
                <div className="grid grid-cols-1 lg:grid-cols-13 gap-8 lg:gap-5">
                <div className="lg:col-span-9 lg:pr-0">
                  {i === 0 && headerNode && (
                    <h2 className="uppercase">{headerNode}</h2>
                  )}

                  {leftArticles[0] && (
                    <>
                      <FeatureArticle article={leftArticles[0]} />
                      {(leftArticles[1] || leftArticles[2] || leftArticles[3]) && <div className="h-[2px] w-full bg-gray-300 dark:bg-news-border my-6"></div>}
                    </>
                  )}
                  
                  {(leftArticles[1] || leftArticles[2]) && (
                    <>
                      <SplitArticles articles={leftArticles.slice(1, 3)} />
                      {leftArticles[3] && <div className="h-[2px] w-full bg-gray-300 dark:bg-news-border my-6"></div>}
                    </>
                  )}
                  
                  {leftArticles[3] && (
                    <SecondaryFeatureArticle article={leftArticles[3]} />
                  )}
                </div>

                <div className="lg:col-span-4 lg:pl-5 border-t-2 lg:border-t-0 lg:border-l-2 border-gray-300 dark:border-news-border mt-6 pt-6 lg:mt-0 lg:pt-0">
                  <RelatedArticlesList articles={rightArticles} />
                </div>
              </div>
            </motion.div>
            )}
          </AnimatePresence>
        );
      })}

      {(totalChunks > 1) && (
        <div className="flex justify-center mt-6 mb-4 border-t-2 border-gray-300 dark:border-news-border pt-6 relative">
          <div className="absolute -top-px left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-news-bg px-6 sm:px-8 flex gap-2 sm:gap-4 w-[95%] sm:w-auto justify-center">
            {visibleChunks > 1 && (
              <motion.button 
                whileTap={{ scale: 0.97 }}
                onClick={handleLoadLess}
                className="whitespace-nowrap px-3 sm:px-5 py-2 border border-gray-400 dark:border-news-text-muted text-gray-600 dark:text-news-text-muted font-bold uppercase tracking-wider text-[12px] sm:text-[13px] hover:bg-gray-200 dark:hover:bg-news-card transition-colors flex items-center justify-center gap-1.5 flex-1 sm:flex-none"
              >
                <ChevronUp className="w-4 h-4 shrink-0" /> कम दिखाएं
              </motion.button>
            )}
            {visibleChunks < totalChunks && (
              <motion.button 
                whileTap={{ scale: 0.97 }}
                onClick={handleLoadMore}
                className="whitespace-nowrap px-3 sm:px-5 py-2 border border-black dark:border-news-border text-black dark:text-news-text font-bold uppercase tracking-wider text-[12px] sm:text-[13px] hover:bg-black dark:hover:bg-news-card hover:text-white dark:hover:text-news-accent transition-colors flex items-center justify-center gap-1.5 flex-1 sm:flex-none"
              >
                और दिखाएं <ChevronDown className="w-4 h-4 shrink-0" />
              </motion.button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
