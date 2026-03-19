'use client'

import { VendorSidebar } from '@/components/vendor-sidebar'
import { VendorHeader } from '@/components/vendor-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function ReturnDetails({ params }: { params: { id: string } }) {
  return (
    <div className="flex h-screen bg-orange-50">
      <VendorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <VendorHeader title="Chi tiết trả hàng" />
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Back Button */}
            <div className="flex items-center justify-between">
              <Link href="/vendor/returns" className="flex items-center gap-2 text-orange-600 hover:text-orange-700">
                <ChevronLeft size={20} />
                Quay lại
              </Link>
              <div className="flex gap-3">
                <Button className="bg-red-500 hover:bg-red-600 text-white">Từ chối</Button>
                <Button className="bg-green-500 hover:bg-green-600 text-white">Chấp nhận</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Return Reason */}
                <Card className="border-2 border-orange-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Lý do trả hàng</h3>
                  <p className="text-gray-700">Sản phẩm không đúng như mô tả. Chất liệu kém, màu sắc bị phai sau vài lần sử dụng.</p>
                </Card>

                {/* Returned Items */}
                <Card className="border-2 border-orange-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Sản phẩm trả lại</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-lg">
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-sm text-gray-500">IMG</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Thảm yoga</p>
                        <p className="text-sm text-gray-600">173x61, Đỏ</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">1x</p>
                        <p className="text-sm text-orange-600 font-semibold">100.000đ</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Evidence */}
                <Card className="border-2 border-orange-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Hình ảnh chứng cứ</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                        Ảnh {i}
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Timeline */}
                <Card className="border-2 border-orange-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Thời gian xử lý</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thời gian yêu cầu:</span>
                      <span className="font-semibold">07/12/2025 20h00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thời gian nhận hàng:</span>
                      <span className="font-semibold">10/12/2025 10h28</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thời gian yêu cầu hoàn tiền:</span>
                      <span className="font-semibold">-</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Customer Info */}
                <Card className="border-2 border-orange-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Thông tin khách</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Họ tên:</span> <span className="font-semibold">Nguyễn Văn A</span></p>
                    <p><span className="text-gray-600">Điện thoại:</span> <span className="font-semibold">0123456789</span></p>
                    <p><span className="text-gray-600">Email:</span> <span className="font-semibold">nguyenvana@gmail.com</span></p>
                  </div>
                </Card>

                {/* Summary */}
                <Card className="border-2 border-orange-200 p-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Giá sản phẩm</span>
                    <span className="font-semibold">100.000đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="font-semibold">0đ</span>
                  </div>
                  <div className="border-t border-orange-200 pt-3 flex justify-between">
                    <span className="font-semibold text-gray-900">Hoàn tiền</span>
                    <span className="font-bold text-lg text-green-600">100.000đ</span>
                  </div>
                </Card>

                {/* Status */}
                <Card className="border-2 border-orange-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Trạng thái</h3>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                    Chờ xác nhận
                  </span>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
