import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import { createSupabaseServerClient } from "@repo/api";
import { getArticleById } from "@/features/articles/queries";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Preview Article | Bharatendu Shikhar",
};

interface PreviewArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function PreviewArticlePage({ params }: PreviewArticlePageProps) {
  const resolvedParams = await params;
  const articleId = parseInt(resolvedParams.id, 10);
  
  if (isNaN(articleId)) {
    redirect("/articles");
  }

  // Get user role to enforce permissions
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: () => {},
    remove: () => {},
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  
  let role = "publisher"; 
  const { supabaseAdmin } = await import("@repo/api");
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
    
  if ((data as unknown as { role?: string })?.role === "admin") {
    role = "admin";
  }

  const authorId = role === "admin" ? null : user.id;

  const article = await getArticleById(articleId, authorId);

  if (!article) {
    redirect("/articles");
  }

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

      <article className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
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
            <p className="text-lg text-gray-600 dark:text-slate-300 font-medium leading-relaxed border-l-4 border-gray-200 dark:border-slate-700 pl-4">
              {article.excerpt}
            </p>
          )}

          <div 
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-serif prose-a:text-red-600 hover:prose-a:text-red-500"
            dangerouslySetInnerHTML={{ __html: article.content || "" }}
          />
        </div>
      </article>
    </div>
  );
}
