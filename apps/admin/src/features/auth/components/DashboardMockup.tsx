export function DashboardMockup() {
  return (
    <div className="w-full h-full bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden select-none pointer-events-none scale-[0.85] origin-top-left opacity-100">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex flex-col">
          <span className="text-white font-bold text-lg leading-tight">Bharatendu Shikhar</span>
          <span className="text-[10px] text-slate-400 font-semibold tracking-wider">CMS PORTAL</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-semibold leading-tight text-slate-200">admin</div>
            <div className="text-[10px] text-slate-500 font-semibold">ADMIN</div>
          </div>
          <div className="w-8 h-8 rounded-full border border-red-900/50 text-[#CC2200] flex items-center justify-center font-bold bg-red-950/30 text-sm">
            A
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-56 bg-slate-900 border-r border-slate-800 flex flex-col p-4">
          <div className="flex flex-col gap-1 mb-auto">
            <div className="flex items-center gap-3 px-3 py-2 bg-red-950/40 text-[#CC2200] rounded-md border-l-4 border-[#CC2200] font-medium text-sm">
              <div className="w-4 h-4 rounded-sm bg-[#CC2200]/20" />
              Dashboard
            </div>
            {['Articles', 'Categories', 'Regions', 'Publishers', 'E-Papers', 'Settings'].map((item) => (
              <div key={item} className="flex items-center gap-3 px-3 py-2 text-slate-400 font-medium text-sm">
                <div className="w-4 h-4 rounded-sm bg-slate-800" />
                {item}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3 mt-8">
            <div className="w-full py-2 bg-[#CC2200] text-white rounded-md flex items-center justify-center gap-2 font-medium text-sm shadow-sm">
              <span>+</span> New Article
            </div>
            <div className="w-full py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-md flex items-center justify-center gap-2 font-medium text-sm shadow-sm">
              <div className="w-3 h-3 border border-slate-500" /> Upload E-Paper
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-hidden bg-slate-950">
          <h1 className="text-2xl font-bold text-slate-100 mb-1">Dashboard</h1>
          <p className="text-sm text-slate-400 mb-6">Overview of your content management activities.</p>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Articles', val: '1,248', icon: 'bg-slate-800 text-slate-400' },
              { label: 'Published', val: '982', icon: 'bg-green-900/30 text-green-500' },
              { label: 'Drafts', val: '24', icon: 'bg-slate-800 text-slate-400' },
              { label: 'E-Papers', val: '156', icon: 'bg-slate-800 text-slate-400' },
              { label: 'Categories', val: '12', icon: 'bg-slate-800 text-slate-400' },
              { label: 'Regions', val: '8', icon: 'bg-slate-800 text-slate-400' },
              { label: 'Active Publishers', val: '45', icon: 'bg-slate-800 text-slate-400' },
              { label: 'Total Publishers', val: '52', icon: 'bg-slate-800 text-slate-400' }
            ].map((stat, i) => (
              <div key={i} className="bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-800 flex flex-col justify-between h-24">
                <div className="flex justify-between items-start">
                  <span className="text-xs text-slate-400 font-medium">{stat.label}</span>
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center ${stat.icon}`}>
                    <div className="w-3 h-3 rounded-sm border border-current opacity-70" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-100">{stat.val}</div>
              </div>
            ))}
          </div>

          {/* Bottom Columns */}
          <div className="grid grid-cols-2 gap-6">
            {/* Recent Articles */}
            <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden flex flex-col h-64">
              <div className="px-5 py-3 border-b border-slate-800 flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                Recent Articles
                <span className="text-[#CC2200]">View All</span>
              </div>
              <div className="flex flex-col p-2">
                {[
                  { title: 'The Future of Digital Publishing in 2026', date: '06/02/2026', author: 'admin', status: 'Published', bg: 'bg-[#0284c7]' },
                  { title: 'Local Elections: A Comprehensive Analysis', date: '06/01/2026', author: 'publisher', status: 'Draft', bg: 'bg-slate-700' },
                  { title: 'Economy Rebounds with New Tech Investments', date: '05/30/2026', author: 'admin', status: 'Published', bg: 'bg-[#0284c7]' }
                ].map((art, i) => (
                  <div key={i} className="flex justify-between items-center p-3 border-b border-slate-800/50 last:border-0">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-200 mb-0.5">{art.title}</span>
                      <span className="text-xs text-slate-500">{art.date} • {art.author}</span>
                    </div>
                    <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${art.bg}`}>
                      {art.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent E-Papers */}
            <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden flex flex-col h-64">
              <div className="px-5 py-3 border-b border-slate-800 flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                Recent E-Papers
                <span className="text-[#CC2200]">View All</span>
              </div>
              <div className="flex gap-4 p-4 h-full">
                <div className="flex-1 bg-slate-800/50 rounded-lg flex items-center justify-center border border-slate-700/50">
                  <div className="w-8 h-8 border-2 border-slate-600 rounded-md flex items-center justify-center text-slate-500 text-xl font-bold">+</div>
                </div>
                <div className="flex-1 border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center text-slate-500 gap-2">
                  <div className="w-6 h-6 border-2 border-slate-600 rounded-md flex items-center justify-center font-bold">+</div>
                  <span className="text-xs font-medium">Upload New</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
