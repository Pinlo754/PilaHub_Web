'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronRight } from 'lucide-react'

const coaches = [
  {
    name: 'Nguyễn Thanh Phương',
    rating: '10%',
    color: 'bg-yellow-100',
  },
  {
    name: 'Nguyễn Thanh Phương',
    rating: '9%',
    color: 'bg-blue-100',
  },
  {
    name: 'Nguyễn Thanh Phương',
    rating: '8%',
    color: 'bg-yellow-100',
  },
  {
    name: 'Nguyễn Thanh Phương',
    rating: '7%',
    color: 'bg-blue-100',
  },
]

export function CoachRanking() {
  return (
    <Card className="bg-white border-2 border-orange-200 rounded-xl p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
        Bảng xếp hạng Coach
      </h3>

      {/* Coaches List */}
      <div className="space-y-3">
        {coaches.map((coach, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-orange-50 rounded-lg p-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-white">
                {index + 1}
              </div>
              <span className="text-sm text-gray-700">{coach.name}</span>
            </div>
            <Badge className={`${coach.color} text-gray-700 text-xs`}>
              {coach.rating}
            </Badge>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-orange-100 text-xs text-gray-600">
        <span>1/2</span>
        <button className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1">
          <ChevronRight size={14} />
        </button>
      </div>
    </Card>
  )
}
