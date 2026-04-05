"use client";

import { ChevronRight, Search } from "lucide-react";

type Props = {
  searchTerm: string;
  onChange: (v: string) => void;
};

const SearchSection = ({ searchTerm, onChange }: Props) => {
  return (
    <div className="flex gap-4 mb-6">
      {/* Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Tìm kiếm"
          value={searchTerm}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border-2 border-orange-100 rounded-lg focus:outline-none focus:border-orange-300"
        />
      </div>

      {/* Filter */}
      <button className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors flex items-center gap-2">
        Lọc
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default SearchSection;
