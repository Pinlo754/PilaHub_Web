"use client";

import { Card } from "@/components/ui/card";
import { DashboardType, GrossMonthType } from "@/utils/DashboardType";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp, TrendingDown, Banknote } from "lucide-react";

const MONTH_LABELS = [
  "T1",
  "T2",
  "T3",
  "T4",
  "T5",
  "T6",
  "T7",
  "T8",
  "T9",
  "T10",
  "T11",
  "T12",
];

const formatVND = (value: number) => {
  if (Math.abs(value) >= 1_000_000)
    return `${(value / 1_000_000).toFixed(1)}tr`;
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
  return value.toLocaleString("vi-VN");
};

const formatVNDFull = (value: number) => value.toLocaleString("vi-VN") + " ₫";

type Props = {
  data: GrossMonthType[];
  dashboard: DashboardType | null;
};

export function RevenueChart({ data, dashboard }: Props) {
  const chartData = data.map((item) => ({
    date: MONTH_LABELS[item.month - 1] ?? `T${item.month}`,
    value: item.totalGross,
  }));

  const netRevenue = dashboard?.totalNetRevenueMonthly ?? 0;
  const isNetPositive = netRevenue >= 0;

  const summaryCards = [
    {
      label: "Doanh thu tháng",
      value: dashboard?.totalGrossMonthly ?? 0,
      icon: TrendingUp,
      iconColor: "text-green-500",
      bgColor: "bg-green-50",
      valueColor: "text-green-600",
    },
    {
      label: "Hoàn tiền tháng",
      value: dashboard?.totalRefundMonthly ?? 0,
      icon: TrendingDown,
      iconColor: "text-red-400",
      bgColor: "bg-red-50",
      valueColor: "text-red-500",
    },
    {
      label: "Doanh thu thuần",
      value: netRevenue,
      icon: Banknote,
      iconColor: isNetPositive ? "text-blue-500" : "text-orange-500",
      bgColor: isNetPositive ? "bg-blue-50" : "bg-orange-50",
      valueColor: isNetPositive ? "text-blue-600" : "text-orange-500",
    },
  ];

  return (
    <Card className="bg-white border-2 border-orange-200 rounded-xl p-6">
      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-yellow-400" />
        Tổng doanh thu
      </h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`${card.bgColor} rounded-xl px-4 py-3 flex items-center gap-3`}
            >
              <div className="shrink-0">
                <Icon className={`${card.iconColor} w-5 h-5`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 truncate">{card.label}</p>
                <p className={`text-sm font-bold ${card.valueColor} truncate`}>
                  {formatVNDFull(card.value)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="flex justify-center">
        <ResponsiveContainer width="95%" height={490}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#86efac" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#86efac" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatVND}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [formatVNDFull(value), "Doanh thu"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#22c55e"
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
