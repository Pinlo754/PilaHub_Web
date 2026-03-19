'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronRight } from 'lucide-react'

const products = [
  {
    name: 'Thảm yoga',
    quantity: 308,
    price: '585.000đ',
    status: 'hot',
  },
  {
    name: 'Thảm yoga',
    quantity: 308,
    price: '585.000đ',
    status: 'normal',
  },
  {
    name: 'Thảm yoga',
    quantity: 308,
    price: '585.000đ',
    status: 'normal',
  },
  {
    name: 'Thảm yoga',
    quantity: 308,
    price: '585.000đ',
    status: 'normal',
  },
]

export function BestSellingProducts() {
  return (
    <Card className="bg-white border-2 border-orange-200 rounded-xl p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-orange-400"></div>
        Sản phẩm bán chạy
      </h3>

      {/* Table Header */}
      <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-gray-600 mb-3 px-2">
        <div>Sản phẩm</div>
        <div>Số lượng</div>
        <div className="text-right">Tiền</div>
      </div>

      {/* Products List */}
      <div className="space-y-2">
        {products.map((product, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-orange-50 rounded-lg p-2 text-sm"
          >
            <span className="text-gray-700 flex-1">{product.name}</span>
            <span className="text-gray-600">{product.quantity}</span>
            <span className="text-gray-600">{product.price}</span>
            {product.status === 'hot' && (
              <Badge className="bg-green-100 text-green-700 text-xs ml-1">
                Bán chạy
              </Badge>
            )}
            {product.status === 'normal' && (
              <Badge className="bg-orange-100 text-orange-700 text-xs ml-1">
                Bình thường
              </Badge>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-orange-100 text-xs text-gray-600">
        <span>1/2</span>
        <button className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1">
          Xem thêm <ChevronRight size={14} />
        </button>
      </div>
    </Card>
  )
}
