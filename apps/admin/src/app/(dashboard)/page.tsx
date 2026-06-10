import { getDashboardStats } from "@/features/analytics/queries";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";

export const metadata = {
  title: "Dashboard | Bharatendu Shikhar Admin",
};

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const BASE_STATS = [
    { label: "Total Articles", value: stats.totalArticles, icon: "description", cardBg: "btn-primary-gradient text-white", iconBg: "bg-surface/20 text-white" },
    { label: "Published", value: stats.publishedArticles, icon: "check_circle", cardBg: "btn-primary-gradient text-white", iconBg: "bg-surface/20 text-white" },
    { label: "Drafts", value: stats.draftArticles, icon: "edit_document", cardBg: "btn-primary-gradient text-white", iconBg: "bg-surface/20 text-white" },
    { label: "E-Papers", value: stats.totalEpapers, icon: "newspaper", cardBg: "btn-primary-gradient text-white", iconBg: "bg-surface/20 text-white" },
  ];

  const ADMIN_STATS = stats.isAdmin
    ? [
        { label: "Categories", value: stats.totalCategories, icon: "category", cardBg: "btn-primary-gradient text-white", iconBg: "bg-surface/20 text-white" },
        { label: "Regions", value: stats.totalRegions, icon: "public", cardBg: "btn-primary-gradient text-white", iconBg: "bg-surface/20 text-white" },
        { label: "Active Publishers", value: stats.activePublishers, icon: "group", cardBg: "btn-primary-gradient text-white", iconBg: "bg-surface/20 text-white" },
        { label: "Total Publishers", value: stats.totalPublishers, icon: "business", cardBg: "btn-primary-gradient text-white", iconBg: "bg-surface/20 text-white" },
      ]
    : [];

  const STATS = [...BASE_STATS, ...ADMIN_STATS];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of your content management activities.</p>
      </div>

      {/* Stats bento grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {STATS.map(({ label, value, icon, cardBg, iconBg }) => (
          <div
            key={label}
            className={`rounded-2xl p-5 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 shadow-md ${cardBg}`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-semibold opacity-90">{label}</span>
              <span
                className={`material-symbols-outlined text-base p-2 rounded-xl backdrop-blur-sm ${iconBg}`}
              >
                {icon}
              </span>
            </div>
            <div className="font-bold tracking-tight" style={{ fontSize: "32px", lineHeight: "36px" }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Articles */}
        <div className="cms-card">
          <div className="cms-card-header">
            <span className="cms-card-label">Recent Articles</span>
            <Link href="/articles" className="text-sm font-medium text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y divide-surface-variant">
            {stats.recentArticles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="material-symbols-outlined text-5xl text-outline-variant mb-3">article</span>
                <p className="text-sm text-on-surface-variant">No articles yet</p>
                <p className="text-xs text-outline mt-0.5">Create your first article to get started</p>
              </div>
            ) : (
              stats.recentArticles.map((article) => (
                <Link
                  key={article.id}
                  href="/articles"
                  className="px-5 py-4 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group"
                >
                  <div>
                    <h3 className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">{article.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-on-surface-variant">
                        {new Date(article.created_at).toLocaleDateString()}
                      </p>
                      {article.author?.full_name && (
                        <>
                          <span className="text-outline-variant">•</span>
                          <p className="text-xs text-on-surface-variant">{article.author.full_name}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <StatusBadge variant={article.status} />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent E-Papers */}
        <div className="cms-card">
          <div className="cms-card-header">
            <span className="cms-card-label">Recent E-Papers</span>
            <Link href="/epapers" className="text-sm font-medium text-primary hover:underline">
              View All
            </Link>
          </div>
          {stats.recentEpapers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="material-symbols-outlined text-5xl text-outline-variant mb-3">newspaper</span>
              <p className="text-sm text-on-surface-variant">No e-papers yet</p>
              <Link href="/epapers/new" className="btn-cms-secondary mt-3">
                <span className="material-symbols-outlined text-[18px]">upload_file</span>
                Upload E-Paper
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 p-4">
              {stats.recentEpapers.map((epaper) => (
                <a
                  key={epaper.id}
                  href={epaper.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-surface-variant rounded-lg p-3 hover:border-primary/50 transition-colors cursor-pointer group block"
                >
                  <div className="aspect-3/4 bg-surface-variant rounded-md mb-2 flex items-center justify-center overflow-hidden">
                    <span className="material-symbols-outlined text-4xl text-red-500/70 group-hover:scale-110 transition-transform group-hover:text-red-600">
                      picture_as_pdf
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-on-surface truncate">{epaper.title}</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {new Date(epaper.created_at).toLocaleDateString()}
                  </p>
                </a>
              ))}
              <Link
                href="/epapers/new"
                className="border border-dashed border-outline-variant rounded-lg p-3 flex flex-col items-center justify-center hover:bg-surface-container-low transition-colors cursor-pointer text-on-surface-variant hover:text-primary"
              >
                <span className="material-symbols-outlined text-2xl mb-1">upload_file</span>
                <span className="text-xs font-medium">Upload New</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
