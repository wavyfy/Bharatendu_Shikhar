import { getSessionUser } from "@/utils/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getArticleById } from "@/features/articles/queries";
import { Button } from "@/components/ui/Button";

import { sanitize } from "@repo/api";

export const metadata = {
  title: "Preview Article | Bharatendu Shikhar",
};

interface PreviewArticlePageProps {
  params: Promise<{ id: string }>;
}

import { getLiveUpdatesByArticleId } from "@/features/articles/queries/liveUpdates";

/**
 * Renders an article preview page.
 *
 * Requires user authentication. Admins can preview any article; publishers can only preview their own articles. If the article is marked as live, displays a timeline of live updates sorted by most recent first.
 */
export default async function PreviewArticlePage({ params }: PreviewArticlePageProps) {
  const resolvedParams = await params;
  const articleId = parseInt(resolvedParams.id, 10);
  
  if (isNaN(articleId)) {
    redirect("/articles");
  }

  // Get user role to enforce permissions
  const session = await getSessionUser();
  const user = session?.user;
  if (!user) redirect("/login");
  const role = session?.role || "publisher";

  const authorId = role === "admin" ? null : user.id;

  const article = await getArticleById(articleId, authorId);

  if (!article) {
    redirect("/articles");
  }

  const liveUpdates = article.is_live ? await getLiveUpdatesByArticleId(articleId) : [];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/articles">
            <Button variant="ghost" size="sm">
              &larr; Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-slate-100 font-serif">Preview</h1>
            <p className="text-neutral-500 dark:text-slate-400 text-sm">
              Status: <span className="font-semibold text-neutral-800 dark:text-slate-200">{article.status}</span>
            </p>
          </div>
        </div>
        <Link href={`/articles/${article.id}/edit`}>
          <Button>Edit Article</Button>
        </Link>
      </div>

      <article className="bg-surface rounded-xl shadow-sm border border-outline-variant overflow-hidden">
        {article.featured_image ? (
          <div className="relative w-full aspect-video bg-gray-100 dark:bg-slate-700/50">
            <Image
              src={article.featured_image}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="w-full aspect-video bg-gray-100 dark:bg-slate-700/50 flex items-center justify-center">
            <p className="text-gray-400 dark:text-slate-500">No featured image</p>
          </div>
        )}
        
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <div className="flex gap-2 text-sm text-red-600 font-medium">
              {article.category?.name && <span>{article.category.name}</span>}
              {article.category?.name && article.region?.name && <span>•</span>}
              {article.region?.name && <span>{article.region.name}</span>}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-slate-100 font-serif leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-slate-400 pt-2">
              <span>By {article.author?.full_name || "Unknown"}</span>
              <span>•</span>
              <time dateTime={article.created_at}>
                {new Date(article.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </time>
            </div>
          </div>

          {article.excerpt && (
            <p className="text-lg text-gray-600 dark:text-slate-300 font-medium leading-relaxed border-l-4 border-outline-variant pl-4">
              {article.excerpt}
            </p>
          )}

          <div 
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-serif prose-a:text-red-600 hover:prose-a:text-red-500"
            dangerouslySetInnerHTML={{ __html: sanitize(article.content || "") }}
          />

          {/* Live Timeline Preview */}
          {article.is_live && liveUpdates && liveUpdates.length > 0 && (
            <div className="mt-12 border-t-2 border-outline-variant pt-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-3.5 h-3.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-black dark:text-white">Live Updates</h2>
              </div>
              
              <div className="relative">
                {/* Vertical Timeline Line */}
                <div className="absolute left-[7px] top-3 bottom-0 w-[2px] bg-black dark:bg-gray-400" />

                <div className="flex flex-col gap-10">
                  {liveUpdates.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((update) => (
                    <div key={update.id} className="relative pl-8 md:pl-12">
                      {/* Timeline Dot */}
                      <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-black dark:bg-gray-300" />

                      {/* Date Button */}
                      <div className="bg-red-600 text-white rounded-full px-5 py-1.5 text-xs font-medium inline-block mb-4 -ml-2 md:-ml-6">
                        {new Date(update.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(update.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </div>

                      {/* Content */}
                      <div className="flex flex-col items-start w-full">
                        <h3 className="text-2xl md:text-3xl font-bold font-serif text-black dark:text-white leading-tight mb-3">
                          {update.headline}
                        </h3>

                        <div
                          className="prose prose-lg max-w-none w-full dark:prose-invert prose-p:text-gray-800 dark:prose-p:text-gray-200 prose-p:leading-[1.8] prose-a:text-red-600"
                          dangerouslySetInnerHTML={{ __html: sanitize(update.content) }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
