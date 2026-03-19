'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { Search, ChevronRight, ChevronLeft } from 'lucide-react'

const courses = [
  {
    id: '01234',
    name: 'Khóa học giáo căn có bản',
    level: 'Cơ bản',
    date: '04/12/2025',
    status: 'Chưa xác thực',
  },
  {
    id: '01235',
    name: 'Khóa học yoga nâng cao',
    level: 'Nâng cao',
    date: '05/12/2025',
    status: 'Đang xử lý',
  },
  {
    id: '01236',
    name: 'Khóa học pilates toàn thân',
    level: 'Trung bình',
    date: '06/12/2025',
    status: 'Đang hoạt động',
  },
  {
    id: '01237',
    name: 'Khóa học thiền định tính',
    level: 'Cơ bản',
    date: '07/12/2025',
    status: 'Tạm dừng',
  },
  {
    id: '01238',
    name: 'Khóa học vệ sinh sức khỏe',
    level: 'Nâng cao',
    date: '08/12/2025',
    status: 'Đang hoạt động',
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

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Cơ bản':
      return 'bg-blue-100 text-blue-700'
    case 'Trung bình':
      return 'bg-orange-100 text-orange-700'
    case 'Nâng cao':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="flex h-screen bg-orange-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Khóa học cơ bản" />
        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6">
            {/* Search and Filter */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm khóa học"
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
                    <th className="text-left py-3 px-4 font-semibold text-orange-700">Mã</th>
                    <th className="text-left py-3 px-4 font-semibold text-orange-700">Tên khóa học</th>
                    <th className="text-left py-3 px-4 font-semibold text-orange-700">Cấp độ</th>
                    <th className="text-left py-3 px-4 font-semibold text-orange-700">Ngày cập nhật</th>
                    <th className="text-left py-3 px-4 font-semibold text-orange-700">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course, index) => (
                    <tr key={index} className="border-b border-orange-100 hover:bg-orange-50">
                      <td className="py-3 px-4 text-gray-700">{course.id}</td>
                      <td className="py-3 px-4 text-gray-700">{course.name}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)}`}>
                          {course.level}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{course.date}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(course.status)}`}>
                          {course.status}
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
