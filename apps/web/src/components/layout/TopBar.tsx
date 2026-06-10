import { Languages, Sun } from "lucide-react";

export function TopBar() {
  return (
    <div className="py-2 px-4 max-w-[1400px] mx-auto text-sm">
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 rounded-full px-3 py-1.5 text-xs font-medium transition-colors">
            <Languages size={14} /> Toggle Language
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 rounded-full p-1.5 transition-colors">
            <Sun size={14} />
          </button>
        </div>
        <div className="flex gap-3">
          <button className="border border-red-600 text-red-600 hover:bg-red-50 rounded-full px-5 py-1.5 text-xs font-medium transition-colors">
            Read ePaper
          </button>
          <button className="bg-red-600 text-white hover:bg-red-700 rounded-full px-5 py-1.5 text-xs font-medium transition-colors">
            Get the App
          </button>
        </div>
      </div>
    </div>
  );
}
