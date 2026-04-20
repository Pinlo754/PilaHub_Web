"use client";

import { Card } from "@/components/ui/card";
import { DashboardType } from "@/utils/DashboardType";
import { Users, Package, UserCheck, ShoppingCart } from "lucide-react";

type Props = {
  dashboard: DashboardType | null;
};

export function StatsCards({ dashboard }: Props) {
  const stats = [
    {
      icon: Users,
      value: dashboard?.totalTrainees ?? 0,
      label: "Học viên",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-500",
    },
    {
      icon: Package,
      value: dashboard?.totalVendors ?? 0,
      label: "Vendor",
      bgColor: "bg-amber-100",
      iconColor: "text-amber-500",
    },
    {
      icon: UserCheck,
      value: dashboard?.totalCoaches ?? 0,
      label: "Huấn luyện viên",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-500",
    },
    {
      icon: ShoppingCart,
      value: dashboard?.transactionsToday ?? 0,
      label: "Giao dịch hôm nay",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="bg-white border-2 border-orange-200 rounded-xl p-4 flex items-center gap-4"
          >
            <div className={`${stat.bgColor} rounded-lg p-3`}>
              <Icon className={`${stat.iconColor} w-6 h-6`} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800 text-center">
                {stat.value}
              </p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
