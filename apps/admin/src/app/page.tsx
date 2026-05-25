export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#111] font-sans">
      <style
        dangerouslySetInnerHTML={{
          __html: `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');
          .font-playfair { font-family: 'Playfair Display', serif; }`,
        }}
      />

      {/* Topbar */}
      <header className="h-14 border-b border-gray-300 bg-white flex items-center px-6 justify-between">
        <span className="font-playfair font-black text-xl text-[#111]">
          Bharatendu Shikhar
        </span>
        <span className="text-xs font-semibold text-gray-400 tracking-wide">
          Admin Panel
        </span>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-52 border-r border-gray-300 min-h-[calc(100vh-56px)] pt-6 px-3 flex flex-col gap-1 shrink-0 bg-white">
          {[
            { label: "Dashboard", active: true },
            { label: "Articles", active: false },
            { label: "Categories", active: false },
            { label: "Users", active: false },
            { label: "Settings", active: false },
          ].map(({ label, active }) => (
            <button
              key={label}
              className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${
                active
                  ? "bg-[#CC2200]/10 text-[#CC2200]"
                  : "text-gray-600 hover:bg-gray-100 hover:text-[#111]"
              }`}
            >
              {label}
            </button>
          ))}
        </aside>

        {/* Main */}
        <main className="flex-1 p-8">
          <h1 className="text-xl font-bold mb-6">Dashboard</h1>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Articles", value: "—", highlight: false },
              { label: "Published", value: "—", highlight: true },
              { label: "Users", value: "—", highlight: false },
              { label: "Visitors Today", value: "—", highlight: false },
            ].map(({ label, value, highlight }) => (
              <div
                key={label}
                className={`rounded-lg border p-5 ${
                  highlight
                    ? "border-[#CC2200]/30 bg-[#CC2200]/5"
                    : "border-gray-200 bg-white"
                }`}
              >
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p
                  className={`text-2xl font-bold ${highlight ? "text-[#CC2200]" : ""}`}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Table + actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Recent Articles
              </div>
              <div className="flex items-center justify-center h-28 text-sm text-gray-400">
                No articles yet
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Quick Actions
              </div>
              <div className="p-4 flex flex-col gap-2">
                <button className="w-full bg-[#CC2200] hover:bg-[#B31E00] text-white text-sm font-semibold py-2 px-4 rounded transition-colors">
                  + New Article
                </button>
                <button className="w-full border border-gray-300 hover:border-gray-400 text-sm font-semibold py-2 px-4 rounded transition-colors text-[#111]">
                  Add Category
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
