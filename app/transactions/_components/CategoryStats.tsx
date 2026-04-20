"use client";

import {
  TRANSACTION_CATEGORY_MAP,
  TransactionCategoryType,
} from "@/utils/uiMapper";
import { TransactionType } from "@/utils/TransactionType";

type Props = {
  transactions: TransactionType[];
  selectedCategory: TransactionCategoryType;
  onCategoryChange: (category: TransactionCategoryType) => void;
};

const CategoryStats = ({
  transactions,
  selectedCategory,
  onCategoryChange,
}: Props) => {
  const categories: TransactionCategoryType[] = [
    "ALL",
    "WALLET",
    "ORDER",
    "BOOKING",
    "PACKAGE",
    "COURSE",
    "FEES",
    "VENDOR",
    "OTHER",
  ];

  const getCategoryCount = (category: TransactionCategoryType): number => {
    if (category === "ALL") return transactions.length;

    const categoryTypes: Record<TransactionCategoryType, string[]> = {
      ALL: [],
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

    return transactions.filter((t) =>
      categoryTypes[category].includes(t.transactionType as any),
    ).length;
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => {
        const config = TRANSACTION_CATEGORY_MAP[category];
        const count = getCategoryCount(category);
        const isActive = selectedCategory === category;

        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              isActive
                ? `${config.bgColor} ${config.textColor} ring-2 ring-offset-2 ring-orange-300`
                : `${config.bgColor} ${config.textColor} opacity-60 hover:opacity-100`
            }`}
          >
            {config.label}
            <span className="ml-2 font-bold">({count})</span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryStats;
