'use client'

import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { Search, ChevronRight, ChevronLeft } from 'lucide-react'

export default function OrdersPage() {
  return (
    <div className="flex h-screen bg-orange-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Đơn hàng" />
        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6">
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm đơn hàng"
                  className="w-full pl-10 pr-4 py-2 border-2 border-orange-100 rounded-lg focus:outline-none focus:border-orange-300"
                />
              </div>
              <button className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors flex items-center gap-2">
                Filter
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="text-center py-12 text-gray-500">
              <p>Chức năng này sẽ sớm được phát triển</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
