'use client'

import { Bell, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface VendorHeaderProps {
  title: string
}

export function VendorHeader({ title }: VendorHeaderProps) {
  return (
    <header className="bg-white border-b border-orange-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-orange-600">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-orange-50">
            <Bell size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-orange-50">
            <User size={20} />
          </Button>
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <span className="text-orange-600 font-semibold">V</span>
          </div>
        </div>
      </div>
    </header>
  )
}
