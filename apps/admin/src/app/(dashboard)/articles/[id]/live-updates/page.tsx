import { getSessionUser } from "@/utils/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getArticleById } from "@/features/articles/queries";
import { getLiveUpdatesByArticleId } from "@/features/articles/queries/liveUpdates";
import { LiveUpdatesSection } from "@/features/articles/components/LiveUpdatesSection";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { PageContainer } from "@/components/ui/PageContainer";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Live Updates | Bharatendu Shikhar",
};

interface LiveUpdatesPageProps {
  params: Promise<{ id: string }>;
}

export default async function LiveUpdatesPage({ params }: LiveUpdatesPageProps) {
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

  const [article, liveUpdates] = await Promise.all([
    getArticleById(articleId, authorId),
    getLiveUpdatesByArticleId(articleId), // gracefully returns [] if migration not applied yet
  ]);

  if (!article) {
    redirect("/articles");
  }

  // If the article isn't marked as live, they shouldn't be here
  if (!article.is_live) {
    redirect(`/articles/${articleId}/edit`);
  }

  return (
    <AnimatedPage>
      <PageContainer>
        <div className="mb-6">
          <Link href="/articles" className="inline-block mb-4">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Back to Articles
            </Button>
          </Link>
          <PageHeader
            title="Live Updates Timeline"
            description={`Manage timeline events for: ${article.title}`}
          />
        </div>
        
        <div className="max-w-4xl">
          <LiveUpdatesSection
            articleId={articleId}
            initialUpdates={liveUpdates}
          />
        </div>
      </PageContainer>
    </AnimatedPage>
  );
}
