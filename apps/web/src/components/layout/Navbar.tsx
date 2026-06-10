import { ChevronDown } from "lucide-react";

export function Navbar() {
  return (
    <>
      <nav className="max-w-[1400px] mx-auto px-4 mb-2">
        <div className="flex justify-between items-center py-4 text-sm font-medium">
          <div className="flex gap-8">
            <a href="#" className="flex items-center gap-1 hover:text-red-600">Home <ChevronDown size={14} className="text-gray-400"/></a>
            <a href="#" className="flex items-center gap-1 hover:text-red-600">Shimla <ChevronDown size={14} className="text-gray-400"/></a>
            <a href="#" className="flex items-center gap-1 hover:text-red-600">Mussoorie <ChevronDown size={14} className="text-gray-400"/></a>
            <a href="#" className="flex items-center gap-1 hover:text-red-600">Nainital <ChevronDown size={14} className="text-gray-400"/></a>
            <a href="#" className="flex items-center gap-1 hover:text-red-600">Auli <ChevronDown size={14} className="text-gray-400"/></a>
            <a href="#" className="flex items-center gap-1 hover:text-red-600">Hamirpur <ChevronDown size={14} className="text-gray-400"/></a>
            <a href="#" className="flex items-center gap-1 hover:text-red-600">Mandi <ChevronDown size={14} className="text-gray-400"/></a>
            <a href="#" className="flex items-center gap-1 hover:text-red-600">Kinnaur <ChevronDown size={14} className="text-gray-400"/></a>
          </div>
          <div>
            <a href="#" className="text-red-600 font-bold uppercase tracking-widest hover:underline">ELECTION</a>
          </div>
        </div>
      </nav>
      
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="h-[2px] w-full bg-gray-400 mb-6"></div>
      </div>
    </>
  );
}
