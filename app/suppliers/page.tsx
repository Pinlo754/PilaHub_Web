'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { Calendar, Search, ChevronRight, ChevronLeft } from 'lucide-react'

const suppliers = [
  {
    id: '01234',
    name: 'Nguyễn Võn A',
    email: 'nguyenvona@gmail.com',
    phone: '0123456789',
    revenue: '565.000đ',
    date: '04/12/2025',
    status: 'Chưa xác thực',
  },
  {
    id: '01234',
    name: 'Nguyễn Võn A',
    email: 'nguyenvona@gmail.com',
    phone: '0123456789',
    revenue: '565.000đ',
    date: '04/12/2025',
    status: 'Đang xử lý',
  },
  {
    id: '01234',
    name: 'Nguyễn Võn A',
    email: 'nguyenvona@gmail.com',
    phone: '0123456789',
    revenue: '565.000đ',
    date: '04/12/2025',
    status: 'Đang hoạt động',
  },
  {
    id: '01234',
    name: 'Nguyễn Võn A',
    email: 'nguyenvona@gmail.com',
    phone: '0123456789',
    revenue: '565.000đ',
    date: '04/12/2025',
    status: 'Tạm dừng',
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Chưa xác thực':
      return 'bg-purple-100 text-purple-700'
    case 'Đang xử lý':
      return 'bg-yellow-100 text-yellow-700'
    case 'Đang hoạt động':
      return 'bg-green-100 text-green-700'
    case 'Tạm dừng':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export default function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <div className="flex h-screen bg-orange-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Nhà cung cấp" />
        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6">
            {/* Search and Filter */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm nhà cung cấp"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-orange-100 rounded-lg focus:outline-none focus:border-orange-300"
                />
              </div>
              <button className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors flex items-center gap-2">
                Filter
                <ChevronRight size={18} />
              </button>
              <button className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors flex items-center gap-2">
                Filter
                <ChevronRight size={18} />
              </button>
              <button className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors flex items-center gap-2">
                Filter
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-orange-100">
                    <th className="text-left py-3 px-4 font-semibold text-orange-700">Mã nhà cung cấp</th>
                    <th className="text-left py-3 px-4 font-semibold text-orange-700">Tên nhà cung cấp</th>
                    <th className="text-left py-3 px-4 font-semibold text-orange-700">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-orange-700">Số điện thoại</th>
                    <th className="text-left py-3 px-4 font-semibold text-orange-700">Doanh thu</th>
                    <th className="text-left py-3 px-4 font-semibold text-orange-700">Ngày đăng ký</th>
                    <th className="text-left py-3 px-4 font-semibold text-orange-700">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((supplier, index) => (
                    <tr key={index} className="border-b border-orange-100 hover:bg-orange-50">
                      <td className="py-3 px-4 text-gray-700">{supplier.id}</td>
                      <td className="py-3 px-4 text-gray-700">{supplier.name}</td>
                      <td className="py-3 px-4 text-gray-700">{supplier.email}</td>
                      <td className="py-3 px-4 text-gray-700">{supplier.phone}</td>
                      <td className="py-3 px-4 text-gray-700 font-semibold">{supplier.revenue}</td>
                      <td className="py-3 px-4 text-gray-700">{supplier.date}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(supplier.status)}`}>
                          {supplier.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <button className="p-1 hover:bg-orange-100 rounded transition-colors">
                <ChevronLeft size={20} className="text-orange-600" />
              </button>
              <span className="text-gray-600 text-sm">1 / 2</span>
              <button className="p-1 hover:bg-orange-100 rounded transition-colors">
                <ChevronRight size={20} className="text-orange-600" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
