import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Dashboard | Bharatendu Shikhar Admin",
};

const STATS = [
  { label: "Total Articles", value: "—", sub: "all time" },
  { label: "Published", value: "—", sub: "live", accent: true },
  { label: "E-Papers", value: "—", sub: "uploaded" },
  { label: "Regions", value: "—", sub: "active" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-[#111]">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Welcome back. Here&apos;s what&apos;s happening.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(({ label, value, sub, accent }) => (
          <div
            key={label}
            className={`rounded-lg border p-5 ${
              accent
                ? "border-[#CC2200]/30 bg-[#CC2200]/5"
                : "border-gray-200 bg-white"
            }`}
          >
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p
              className={`text-3xl font-bold leading-none mb-1 ${
                accent ? "text-[#CC2200]" : "text-[#111]"
              }`}
            >
              {value}
            </p>
            <p className="text-[11px] text-gray-400">{sub}</p>
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Articles */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>Recent Articles</CardHeader>
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
          </Card>
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <Card>
            <CardHeader>Quick Actions</CardHeader>
            <CardBody className="space-y-2">
              <Button fullWidth>+ New Article</Button>
              <Button variant="secondary" fullWidth>
                Upload E-Paper
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>System</CardHeader>
            <CardBody>
              <div className="space-y-2">
                {[
                  { label: "Database", status: "Operational" },
                  { label: "Storage", status: "Operational" },
                  { label: "Auth", status: "Operational" },
                ].map(({ label, status }) => (
                  <div key={label} className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{label}</span>
                    <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
