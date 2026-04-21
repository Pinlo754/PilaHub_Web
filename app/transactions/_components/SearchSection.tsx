"use client";

import { Funnel, Search } from "lucide-react";
import { TransactionTypeEnum, TRANSACTION_TYPE } from "@/utils/TransactionType";
import {
  getTransactionTypeConfig,
  getTransactionCategory,
  TransactionCategoryType,
} from "@/utils/uiMapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  searchTerm: string;
  onChange: (v: string) => void;
  selectedType: TransactionTypeEnum | "ALL";
  onTypeChange: (type: TransactionTypeEnum | "ALL") => void;
  selectedCategory: TransactionCategoryType;
};

// Map category → các types thuộc về nó
const CATEGORY_TYPE_MAP: Record<
  Exclude<TransactionCategoryType, "ALL">,
  TransactionTypeEnum[]
> = {
  WALLET: ["WALLET_TOP_UP", "WALLET_WITHDRAWAL"],
  ORDER: ["ORDER"],
  BOOKING: ["BOOKING_COACH", "BOOKING_COACH_REFUND"],
  PACKAGE: [
    "SUBSCRIPTION_PACKAGE",
    "SUBSCRIPTION_PRORATION_REFUND",
    "SUBSCRIPTION_UPGRADE",
  ],
  COURSE: ["COURSE"],
  FEES: ["PLATFORM_FEE", "SHIPPING_FEE_THIRD_PARTY", "SHIPPING_FEE_VENDOR"],
  VENDOR: ["VENDOR_PAYOUT", "VENDOR_EARNING"],
  OTHER: ["REFUND", "PENALTY"],
};

const ALL_TYPES = Object.values(TRANSACTION_TYPE) as TransactionTypeEnum[];

const SearchSection = ({
  searchTerm,
  onChange,
  selectedType,
  onTypeChange,
  selectedCategory,
}: Props) => {
  const availableTypes =
    selectedCategory === "ALL"
      ? ALL_TYPES
      : (CATEGORY_TYPE_MAP[
          selectedCategory as Exclude<TransactionCategoryType, "ALL">
        ] ?? ALL_TYPES);

  return (
    <div className="flex justify-between gap-4 mb-6">
      {/* Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Tìm theo..."
          value={searchTerm}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border-2 border-orange-100 rounded-lg focus:outline-none focus:border-orange-300"
        />
      </div>

      {/* Filter by type */}
      <div className="w-50">
        <Select
          value={selectedType}
          onValueChange={(val) =>
            onTypeChange(val as TransactionTypeEnum | "ALL")
          }
        >
          <SelectTrigger className="border-2 border-orange-100 hover:border-orange-200 !h-[44px] focus:ring-0 focus:border-orange-300">
            <div className="flex items-center gap-2">
              <Funnel size={16} className="text-orange-600 flex-shrink-0" />
              <SelectValue placeholder="Loại giao dịch" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả loại</SelectItem>
            {availableTypes.map((type) => {
              const config = getTransactionTypeConfig(type);
              return (
                <SelectItem key={type} value={type}>
                  {config.label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SearchSection;
