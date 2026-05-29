import { Card, CardHeader } from "@/components/ui/Card";
import { getDashboardStats } from "@/features/analytics/queries";
import { AnimatedPage } from "@/components/ui/AnimatedPage";

export const metadata = {
  title: "Dashboard | Bharatendu Shikhar Admin",
};

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const STATS = [
    { label: "Total Articles", value: stats.totalArticles, sub: "all time" },
    { label: "Published", value: stats.publishedArticles, sub: "live", accent: true },
    { label: "Drafts", value: stats.draftArticles, sub: "pending" },
    { label: "E-Papers", value: stats.totalEpapers, sub: "uploaded" },
  ];

  if (stats.isAdmin) {
    STATS.push(
      { label: "Categories", value: stats.totalCategories, sub: "active" },
      { label: "Regions", value: stats.totalRegions, sub: "active" },
      { label: "Active Publishers", value: stats.activePublishers, sub: "live accounts" },
      { label: "Total Publishers", value: stats.totalPublishers, sub: "all accounts" }
    );
  }

  return (
    <AnimatedPage className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-[#111] dark:text-slate-100">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
          Welcome back. Here&apos;s what&apos;s happening.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(({ label, value, sub, accent }) => (
          <div
            key={label}
            className={`rounded-lg border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-default ${
              accent
                ? "border-[#CC2200]/30 bg-[#CC2200]/5 hover:border-[#CC2200]/50 dark:border-[#CC2200]/40 dark:bg-[#CC2200]/10"
                : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600"
            }`}
          >
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">{label}</p>
            <p
              className={`text-3xl font-bold leading-none mb-1 ${
                accent ? "text-[#CC2200]" : "text-[#111] dark:text-slate-100"
              }`}
            >
              {value}
            </p>
            <p className="text-[11px] text-gray-400 dark:text-slate-500">{sub}</p>
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Articles */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>Recent Articles</CardHeader>
            {stats.recentArticles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <svg
                  className="w-10 h-10 text-gray-300 mb-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-sm text-gray-400">No articles yet</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Create your first article to get started
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-slate-700">
                {stats.recentArticles.map((article) => (
                  <div key={article.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all duration-200 cursor-pointer">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-slate-100">{article.title}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-gray-500 dark:text-slate-400">
                          {new Date(article.created_at).toLocaleDateString()}
                        </p>
                        {article.author?.full_name && (
                          <>
                            <span className="text-gray-300 dark:text-slate-600">•</span>
                            <p className="text-xs text-gray-600 dark:text-slate-400">
                              {article.author.full_name}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium ${
                      article.status === 'published' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {article.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

          <Card>
            <CardHeader>Recent E-Papers</CardHeader>
            {stats.recentEpapers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <p className="text-sm text-gray-400 dark:text-slate-500">No e-papers yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-slate-700">
                {stats.recentEpapers.map((epaper) => (
                  <div key={epaper.id} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all duration-200 cursor-pointer">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-slate-100 truncate">{epaper.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                      {new Date(epaper.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </AnimatedPage>
  );
}
