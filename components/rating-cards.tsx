'use client'

import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'

export function RatingCards() {
  return (
    <div className="space-y-4">
      {/* Good Ratings Card */}
      <Card className="bg-white border-2 border-orange-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-gray-800">1,235</p>
            <p className="text-sm text-gray-600 mt-2">Đánh giá tốt</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <TrendingUp size={20} className="text-green-600" />
            </div>
            <span className="text-green-600 font-bold">↓</span>
          </div>
        </div>
      </Card>

      {/* Bad Ratings Card */}
      <Card className="bg-white border-2 border-orange-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-gray-800">456</p>
            <p className="text-sm text-gray-600 mt-2">Đánh giá kém</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <TrendingDown size={20} className="text-red-600" />
            </div>
            <span className="text-red-600 font-bold">↑</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
