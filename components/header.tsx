'use client'

import { Bell, User, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="bg-white border-b border-orange-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center">
              <span className="text-xs font-bold text-orange-600">📊</span>
            </div>
            <h1 className="text-xl font-semibold text-orange-700">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-orange-50 rounded-lg px-4 py-2">
            <Calendar size={18} className="text-orange-600" />
            <input 
              type="date" 
              defaultValue="2025-11-01" 
              className="bg-transparent text-sm text-gray-700 border-none outline-none"
            />
            <span className="text-gray-400">-</span>
            <input 
              type="date" 
              defaultValue="2025-12-01" 
              className="bg-transparent text-sm text-gray-700 border-none outline-none"
            />
          </div>

          <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-orange-50">
            <Bell size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-orange-50">
            <User size={20} />
          </Button>
          <span className="text-sm font-medium text-orange-600">Admin</span>
        </div>
      </div>
    </header>
  )
}
