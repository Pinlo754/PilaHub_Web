'use client'

import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DateRangePicker() {
  return (
    <div className="flex items-center gap-2 bg-white border border-orange-200 rounded-lg px-4 py-2">
      <input
        type="date"
        defaultValue="2025-01-11"
        className="text-sm font-medium text-gray-700 outline-none"
      />
      <span className="text-gray-400">-</span>
      <input
        type="date"
        defaultValue="2025-01-12"
        className="text-sm font-medium text-gray-700 outline-none"
      />
      <Button variant="ghost" size="icon" className="ml-2">
        <Calendar size={18} className="text-orange-600" />
      </Button>
    </div>
  )
}
