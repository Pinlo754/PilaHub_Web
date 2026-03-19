'use client'

import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { ChevronLeft, Star, Check, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function SupplierDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex h-screen bg-orange-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Nhà cung cấp" />
        <main className="flex-1 overflow-auto p-6">
          <Link href="/suppliers" className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-4">
            <ChevronLeft size={20} />
            <span>Quay lại</span>
          </Link>

          <div className="grid grid-cols-3 gap-6">
            {/* Supplier Info */}
            <div className="bg-white rounded-2xl border-2 border-orange-200 p-6">
              <h3 className="text-lg font-semibold text-orange-700 mb-4">Thông tin nhà cung cấp</h3>
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-3xl text-white font-bold">Z</span>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-orange-700 font-semibold">Tên: Shopname1</p>
                </div>
                <div>
                  <p className="text-gray-600">Ngày đăng ký: 01/01/2022</p>
                </div>
                <div>
                  <p className="text-gray-600">Email: abc@gmail.com</p>
                </div>
                <div>
                  <p className="text-gray-600">Số điện thoại: 0123456789</p>
                </div>
                <div>
                  <p className="text-gray-600">Trạng thái: Đang hoạt động</p>
                </div>
              </div>
            </div>

            {/* Product Catalog */}
            <div className="bg-white rounded-2xl border-2 border-orange-200 p-6">
              <h3 className="text-lg font-semibold text-orange-700 mb-4">Danh sách sản phẩm</h3>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="flex items-center gap-3 pb-3 border-b border-orange-100 last:border-b-0">
                    <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-orange-700">YG</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">Thảm yoga</p>
                      <p className="text-xs text-gray-500">308</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-700">565.000đ</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-orange-600 text-sm font-semibold hover:text-orange-700">
                Xem thêm →
              </button>
            </div>

            {/* Stats and Ratings */}
            <div className="space-y-6">
              {/* Rating */}
              <div className="bg-white rounded-2xl border-2 border-orange-200 p-6">
                <h3 className="text-lg font-semibold text-orange-700 mb-4">Đánh giá</h3>
                <div className="flex justify-center gap-1 mb-3">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} size={32} className="text-yellow-400 fill-yellow-400" />
                  ))}
                  <Star size={32} className="text-gray-300" />
                </div>
                <p className="text-center text-2xl font-bold text-gray-700">4/5</p>
              </div>

              {/* Status Info */}
              <div className="bg-white rounded-2xl border-2 border-orange-200 p-6">
                <h3 className="text-lg font-semibold text-orange-700 mb-4">Vị trí: Đang hoạt động</h3>
                <p className="text-sm text-gray-600 mb-4">Số dư: 9.876.000 VND</p>
                <button className="w-full px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors">
                  Xem chi tiết →
                </button>
              </div>

              {/* Certificates */}
              <div className="bg-white rounded-2xl border-2 border-orange-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle size={20} className="text-orange-700" />
                  <h3 className="text-lg font-semibold text-orange-700">Chứng chỉ, chứng nhận</h3>
                </div>
                <p className="text-xs text-gray-600 mb-3">Giấy phép kinh doanh: Đang hoạt động</p>
                <p className="text-xs text-red-500 mb-4">
                  Chứng chỉ sản phẩm: 19/30 (1 sản phẩm cần cập nhật chứng chỉ)
                </p>
                <button className="w-full px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium">
                  Xem chi tiết →
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
