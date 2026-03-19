'use client'

import { Card } from '@/components/ui/card'
import { Users, Package, UserCheck, ShoppingCart } from 'lucide-react'

const stats = [
  {
    icon: Users,
    value: '3000',
    label: 'Học viên',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-500',
  },
  {
    icon: Package,
    value: '100',
    label: 'Vendor',
    bgColor: 'bg-amber-100',
    iconColor: 'text-amber-500',
  },
  {
    icon: UserCheck,
    value: '16',
    label: 'Huấn luyện viên',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-500',
  },
  {
    icon: ShoppingCart,
    value: '300',
    label: 'Giao dịch hôm nay',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-500',
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card
            key={index}
            className="bg-white border-2 border-orange-200 rounded-xl p-4 flex items-center gap-4"
          >
            <div className={`${stat.bgColor} rounded-lg p-3`}>
              <Icon className={`${stat.iconColor} w-6 h-6`} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
