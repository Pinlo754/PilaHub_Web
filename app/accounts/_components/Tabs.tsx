"use client";

import { RoleType } from "@/utils/AccountType";
import { ACCOUNT_ROLE_MAP } from "@/utils/uiMapper";
import { useRouter } from "next/navigation";

type CategoryItem = {
  key: "ACCOUNT" | RoleType;
  label: string;
  route: string;
  bgColor: string;
  textColor: string;
};

const CATEGORIES: CategoryItem[] = [
  {
    key: "ACCOUNT",
    label: "Tài khoản",
    route: "/accounts",
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
  },
  {
    key: "COACH",
    label: ACCOUNT_ROLE_MAP.COACH.label,
    route: "/coaches",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  {
    key: "VENDOR",
    label: ACCOUNT_ROLE_MAP.VENDOR.label,
    route: "/suppliers",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
  {
    key: "TRAINEE",
    label: ACCOUNT_ROLE_MAP.TRAINEE.label,
    route: "/trainees",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
  },
];

type Props = {
  activeKey: "ACCOUNT" | RoleType;
};

const Tabs = ({ activeKey }: Props) => {
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {CATEGORIES.map((category) => {
        const isActive = activeKey === category.key;

        return (
          <button
            key={category.key}
            onClick={() => router.push(category.route)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
              isActive
                ? `${category.bgColor} ${category.textColor} ring-2 ring-offset-2 ring-orange-300`
                : `${category.bgColor} ${category.textColor} opacity-60 hover:opacity-100`
            }`}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
