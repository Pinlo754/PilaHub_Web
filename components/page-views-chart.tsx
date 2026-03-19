'use client'

import { Card } from '@/components/ui/card'
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

const pageViewsData = [
  { date: '1', views: 20000 },
  { date: '2', views: 35000 },
  { date: '3', views: 50000 },
  { date: '4', views: 55000 },
  { date: '5', views: 65000 },
  { date: '6', views: 75000 },
  { date: '7', views: 77750 },
]

export function PageViewsChart() {
  return (
    <Card className="bg-white border-2 border-orange-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600">Lượt truy cập</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">77750</p>
        </div>
        <button className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center hover:bg-orange-200 transition-colors">
          →
        </button>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={pageViewsData}>
          <defs>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#9ca3af' }} />
          <YAxis hide={true} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Area
            type="monotone"
            dataKey="views"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorViews)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}
