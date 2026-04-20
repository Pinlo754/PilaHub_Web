"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CoachType } from "@/utils/DashboardType";
import { useState } from "react";

const PAGE_SIZE = 6;

const BADGE_COLORS = ["bg-yellow-100", "bg-blue-100"];

type Props = {
  coaches: CoachType[];
};

export function CoachRanking({ coaches }: Props) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(coaches.length / PAGE_SIZE));
  const paginated = coaches.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Card className="bg-white border-2 border-orange-200 rounded-xl p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
        Bảng xếp hạng Coach
      </h3>

      {/* Coaches List */}
      <div className="space-y-3">
        {paginated.map((coach, index) => {
          const globalIndex = (page - 1) * PAGE_SIZE + index;
          return (
            <div
              key={globalIndex}
              className="flex items-center justify-between bg-orange-50 rounded-lg p-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-white">
                  {globalIndex + 1}
                </div>
                <span className=" text-gray-700">{coach.name}</span>
              </div>
              <Badge
                className={`${BADGE_COLORS[index % 2]} text-gray-700 text-xs`}
              >
                {coach.avgRating.toFixed(1)}
              </Badge>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-2 pt-4 border-t border-orange-100 text-xs text-gray-600">
        <span>
          {page}/{totalPages}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="text-orange-600 hover:text-orange-700 disabled:opacity-30"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="text-orange-600 hover:text-orange-700 disabled:opacity-30"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </Card>
  );
}
