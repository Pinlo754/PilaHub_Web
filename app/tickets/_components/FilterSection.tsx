"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TicketStatusType } from "@/utils/TicketType";
import { TICKET_STATUS_SELECT_OPTIONS } from "@/utils/uiMapper";
import { Funnel } from "lucide-react";

type Props = {
  statusFilter: TicketStatusType | "";
  onChange: (value: TicketStatusType | "") => void;
};

const FilterSection = ({ statusFilter, onChange }: Props) => {
  return (
    <div className="w-52 mb-4">
      <Select
        value={statusFilter || "ALL"}
        onValueChange={(val) =>
          onChange(val === "ALL" ? "" : (val as TicketStatusType))
        }
      >
        <SelectTrigger className="border-2 border-orange-100 hover:border-orange-200 !h-[44px] focus:ring-0 focus:border-orange-300">
          <div className="flex items-center gap-2">
            <Funnel size={16} className="text-orange-600 flex-shrink-0" />
            <SelectValue placeholder="Trạng thái" />
          </div>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">Tất cả trạng thái</SelectItem>

          {TICKET_STATUS_SELECT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterSection;
