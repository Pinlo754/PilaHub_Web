"use client";

import { ORDER_STATUS, OrderStatusType } from "@/utils/OrderType";
import { getOrderStatusConfig } from "@/utils/uiMapper";
import { ChevronRight, Search } from "lucide-react";

type Props = {
  searchTerm: string;
  onChange: (v: string) => void;
  statusFilter: OrderStatusType | "ALL";
  setStatusFilter: (v: OrderStatusType | "ALL") => void;
};

const STATUS_OPTIONS: Array<{ value: OrderStatusType | "ALL"; label: string }> =
  [
    { value: "ALL", label: "Tất cả" },
    ...Object.values(ORDER_STATUS).map((s) => ({
      value: s,
      label: getOrderStatusConfig(s).label,
    })),
  ];

const SearchSection = ({
  searchTerm,
  onChange,
  setStatusFilter,
  statusFilter,
}: Props) => {
  return (
    <div className="flex gap-4 mb-6">
      {/* Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên người nhận..."
          value={searchTerm}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border-2 border-orange-100 rounded-lg focus:outline-none focus:border-orange-300"
        />
      </div>

      {/* Filter */}
      <select
        value={statusFilter}
        onChange={(e) =>
          setStatusFilter(e.target.value as OrderStatusType | "ALL")
        }
        className="rounded-xl border-2 border-orange-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-700 min-w-[160px]"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchSection;
