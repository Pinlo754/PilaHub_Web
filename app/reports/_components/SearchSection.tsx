"use client";

import { ChevronRight, Funnel, Plus, Search } from "lucide-react";

type Props = {
  searchTerm: string;
  onChange: (v: string) => void;
  statusFilter: "ALL" | "RESOLVED" | "UNRESOLVED";
  onStatusFilterChange: (status: "ALL" | "RESOLVED" | "UNRESOLVED") => void;
};

const SearchSection = ({
  searchTerm,
  onChange,
  statusFilter,
  onStatusFilterChange,
}: Props) => {
  return (
    <div className="flex gap-4 mb-6">
      {/* Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Tìm kiếm tài khoản"
          value={searchTerm}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border-2 border-orange-100 rounded-lg focus:outline-none focus:border-orange-300"
        />
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 bg-orange-100 rounded-lg px-4 py-2">
        <Funnel size={18} className="text-orange-700" />
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as any)}
          className="bg-transparent text-orange-700 font-medium border-none outline-none cursor-pointer"
        >
          <option value="ALL">Tất cả</option>
          <option value="UNRESOLVED">Chờ xử lý</option>
          <option value="RESOLVED">Đã xử lý</option>
        </select>
      </div>

      {/* Create */}
      {/* <button
        onClick={openCreateModal}
        className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors flex items-center gap-2"
      >
        <Plus size={18} />
        Tạo tài khoản
      </button> */}
    </div>
  );
};

export default SearchSection;
