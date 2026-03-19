'use client'

import { VendorSidebar } from '@/components/vendor-sidebar'
import { VendorHeader } from '@/components/vendor-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search, Plus, Edit2, Trash2 } from 'lucide-react'
import Link from 'next/link'

const products = [
  { id: 1, name: 'Thảm yoga', sku: 'YG001', category: 'Dụng cụ tập', brand: 'Decathlon', stock: 100, price: 100000, sales: 25, status: 'active' },
  { id: 2, name: 'Thảm yoga cao su', sku: 'YG002', category: 'Dụng cụ tập', brand: 'Decathlon', stock: 80, price: 150000, sales: 18, status: 'active' },
  { id: 3, name: 'Quần tập', sku: 'QT001', category: 'Quần áo', brand: 'Decathlon', stock: 45, price: 200000, sales: 42, status: 'active' },
  { id: 4, name: 'Áo thun tập', sku: 'AT001', category: 'Quần áo', brand: 'Decathlon', stock: 120, price: 120000, sales: 65, status: 'active' },
]

export default function VendorStore() {
  return (
    <div className="flex h-screen bg-orange-50">
      <VendorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <VendorHeader title="Cửa hàng" />
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Header with Search and Add */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 flex items-center gap-2 bg-white rounded-lg border border-orange-200 px-4">
                <Search size={20} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm sản phẩm..."
                  className="flex-1 py-2 outline-none"
                />
              </div>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2">
                <Plus size={20} />
                Thêm sản phẩm
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card className="border-2 border-orange-200 p-4">
                <p className="text-gray-600 text-sm">Sản phẩm</p>
                <p className="text-2xl font-bold text-orange-600">510</p>
              </Card>
              <Card className="border-2 border-green-200 p-4">
                <p className="text-gray-600 text-sm">Hoạt động</p>
                <p className="text-2xl font-bold text-green-600">326</p>
              </Card>
              <Card className="border-2 border-yellow-200 p-4">
                <p className="text-gray-600 text-sm">Khóa</p>
                <p className="text-2xl font-bold text-yellow-600">52</p>
              </Card>
              <Card className="border-2 border-red-200 p-4">
                <p className="text-gray-600 text-sm">Hết hàng</p>
                <p className="text-2xl font-bold text-red-600">34</p>
              </Card>
              <Card className="border-2 border-gray-200 p-4">
                <p className="text-gray-600 text-sm">Bị báo cáo</p>
                <p className="text-2xl font-bold text-gray-600">57</p>
              </Card>
            </div>

            {/* Products Table */}
            <Card className="border-2 border-orange-200 p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-orange-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">STT</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Sản phẩm</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">SKU</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Danh mục</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Giá</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Kho</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Bán</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <tr key={product.id} className="border-b border-gray-100 hover:bg-orange-50">
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className="py-3 px-4 font-medium text-gray-900">{product.name}</td>
                        <td className="py-3 px-4 text-gray-600">{product.sku}</td>
                        <td className="py-3 px-4 text-gray-600">{product.category}</td>
                        <td className="py-3 px-4 font-semibold text-orange-600">{product.price.toLocaleString()}đ</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            product.stock > 50 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold">{product.sales}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Link
                              href={`/vendor/store/${product.id}`}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                            >
                              <Edit2 size={16} />
                            </Link>
                            <button className="p-1 text-red-600 hover:bg-red-50 rounded transition">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
