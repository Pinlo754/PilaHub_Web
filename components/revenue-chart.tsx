'use client'

import { Card } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'

const revenueData = [
  { date: '01/21', value: 120 },
  { date: '02/21', value: 140 },
  { date: '03/21', value: 90 },
  { date: '04/21', value: 130 },
  { date: '05/21', value: 110 },
  { date: '06/21', value: 145 },
  { date: '07/21', value: 125 },
  { date: '08/21', value: 155 },
  { date: '09/21', value: 135 },
  { date: '10/21', value: 160 },
  { date: '11/21', value: 150 },
  { date: '12/21', value: 170 },
]

export function RevenueChart() {
  return (
    <Card className="bg-white border-2 border-orange-200 rounded-xl p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
        Tổng doanh thu
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={revenueData}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#86efac" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#86efac" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
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
    </Card>
  )
}
