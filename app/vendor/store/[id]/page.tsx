'use client'

import { VendorSidebar } from '@/components/vendor-sidebar'
import { VendorHeader } from '@/components/vendor-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function ProductDetails({ params }: { params: { id: string } }) {
  return (
    <div className="flex h-screen bg-orange-50">
      <VendorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <VendorHeader title="Chi tiết sản phẩm" />
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Back Button */}
            <Link href="/vendor/store" className="flex items-center gap-2 text-orange-600 hover:text-orange-700 w-fit">
              <ChevronLeft size={20} />
              Quay lại
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Info */}
                <Card className="border-2 border-orange-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Thông tin cơ bản</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
                      <Input
                        defaultValue="Thảm yoga cao su tự nhiên"
                        className="border-2 border-gray-200"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                        <Input
                          defaultValue="YG002"
                          className="border-2 border-gray-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                        <select className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg">
                          <option>Dụng cụ tập</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                      <textarea
                        rows={4}
                        defaultValue="Thảm yoga cao su tự nhiên, thoáng khí, an toàn cho sức khỏe"
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg"
                      />
                    </div>
                  </div>
                </Card>

                {/* Price & Inventory */}
                <Card className="border-2 border-orange-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Giá & Tồn kho</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán (đ)</label>
                      <Input
                        type="number"
                        defaultValue="150000"
                        className="border-2 border-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Giá gốc (đ)</label>
                      <Input
                        type="number"
                        defaultValue="180000"
                        className="border-2 border-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tồn kho</label>
                      <Input
                        type="number"
                        defaultValue="80"
                        className="border-2 border-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cảnh báo tồn kho</label>
                      <Input
                        type="number"
                        defaultValue="10"
                        className="border-2 border-gray-200"
                      />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Images */}
                <Card className="border-2 border-orange-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Hình ảnh</h3>
                  <div className="space-y-3">
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                      Ảnh 1
                    </div>
                    <Button className="w-full bg-orange-100 text-orange-600 hover:bg-orange-200">
                      + Thêm ảnh
                    </Button>
                  </div>
                </Card>

                {/* Status */}
                <Card className="border-2 border-orange-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Trạng thái</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="status" defaultChecked className="accent-orange-600" />
                      <span className="text-sm text-gray-700">Hoạt động</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="status" className="accent-orange-600" />
                      <span className="text-sm text-gray-700">Nháp</span>
                    </label>
                  </div>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                    Lưu thay đổi
                  </Button>
                  <Button variant="outline" className="w-full border-2 border-gray-200">
                    Hủy
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
