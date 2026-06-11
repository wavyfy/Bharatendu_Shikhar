import { CategoryHeader } from "../shared/CategoryHeader";
import { ExpandableSectionLayout } from "./ExpandableSectionLayout";
import type { ArticleWithAuthor } from "@/utils/mapArticleData";

export type TopicCategoryData = {
  id: string;
  title: string;
  slug?: string;
  links: string[];
  articles: ArticleWithAuthor[];
};

export function TopicSection({ data }: { data: TopicCategoryData }) {
  return (
    <ExpandableSectionLayout 
      articles={data.articles}
      headerNode={<CategoryHeader title={data.title} slug={data.slug} links={data.links} />}
    />
  );
}
