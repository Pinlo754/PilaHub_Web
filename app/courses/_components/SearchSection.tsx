"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LevelType } from "@/utils/CourseType";
import { DIFFICULTY_LEVELS, getLevelLabel } from "@/utils/uiMapper";
import { ChevronRight, Funnel, Plus, Search } from "lucide-react";

type Props = {
  searchTerm: string;
  onChange: (v: string) => void;
  filterLevel: LevelType | "";
  onFilterLevelChange: (level: LevelType | "") => void;
  openDetailModal: () => void;
};

const SearchSection = ({
  searchTerm,
  onChange,
  filterLevel,
  onFilterLevelChange,
  openDetailModal,
}: Props) => {
  return (
    <div className="flex gap-4 mb-6">
      {/* Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border-2 border-orange-100 rounded-lg focus:outline-none focus:border-orange-300"
        />
      </div>

      {/* Filter */}
      <div className="w-40">
        <Select
          value={filterLevel || "ALL"}
          onValueChange={(val) =>
            onFilterLevelChange(val === "ALL" ? "" : (val as LevelType))
          }
        >
          <SelectTrigger className="border-2 border-orange-100 hover:border-orange-200 !h-[44px] focus:ring-0 focus:border-orange-300">
            <div className="flex items-center gap-2">
              <Funnel size={16} className="text-orange-600 flex-shrink-0" />
              <SelectValue placeholder="Độ khó" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả độ khó</SelectItem>
            {DIFFICULTY_LEVELS.map((level) => (
              <SelectItem key={level} value={level}>
                {getLevelLabel(level)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Create */}
      <button
        onClick={openDetailModal}
        className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors flex items-center gap-2"
      >
        <Plus size={18} />
        Tạo khóa học
      </button>
    </div>
  );
};

export default SearchSection;
