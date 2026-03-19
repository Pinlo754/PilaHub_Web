'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Plus, Edit2, Eye, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VendorSidebar } from '@/components/vendor-sidebar'
import { ProductService } from '@/hooks/product.service'

const mockProducts = [{ productId: "123e4567-e89b-12d3-a456-426614174000", vendorId: "123e4567-e89b-12d3-a456-426614174000", vendorBusinessName: "Pilates Pro Shop", categoryId: "123e4567-e89b-12d3-a456-426614174000", categoryName: "Pilates Product", name: "Professional Pilates Mat", description: "High-quality non-slip Pilates mat", imageUrl: "https://via.placeholder.com/100", price: 59.99, stockQuantity: 100, brand: "MatPro", specifications: "180cm x 60cm, 6mm thickness", avgRating: 4.5, reviewCount: 25, active: true, createdAt: "2026-01-23T10:30:00Z", updatedAt: "2026-01-23T10:30:00Z" }, { productId: "223e4567-e89b-12d3-a456-426614174001", vendorId: "123e4567-e89b-12d3-a456-426614174000", vendorBusinessName: "Pilates Pro Shop", categoryId: "223e4567-e89b-12d3-a456-426614174000", categoryName: "Yoga Product", name: "Yoga Blocks Set", description: "Premium cork yoga blocks", imageUrl: "https://via.placeholder.com/100", price: 29.99, stockQuantity: 50, brand: "YogaPro", specifications: "22.5cm x 15cm x 7.5cm, Cork material", avgRating: 4.8, reviewCount: 42, active: true, createdAt: "2026-01-24T10:30:00Z", updatedAt: "2026-01-24T10:30:00Z" },]

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const vendorId =
          typeof window !== 'undefined' ? localStorage.getItem('id') : null

        if (!vendorId) {
          setLoading(false)
          return
        }

        const res = await ProductService.getMyProduct(vendorId)

        if (res.success) {
          const productList = Array.isArray(res.data?.content)
            ? res.data.content
            : []
          setProducts(productList)
        } else {
          setProducts(mockProducts)
        }

      } catch (error) {
        console.error('Fetch products error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && product.active) ||
      (filterStatus === 'inactive' && !product.active)

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex min-h-screen bg-orange-50">
        <VendorSidebar />
        <div className="flex items-center justify-center w-full">
          <p className="text-lg text-orange-700">Đang tải sản phẩm...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-orange-50">
      <VendorSidebar />

      <div className="max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-orange-900">
              Quản lý sản phẩm
            </h1>
            <p className="text-orange-700 mt-1">
              Xem và chỉnh sửa thông tin sản phẩm của bạn
            </p>
          </div>

          <Link href="/vendor/products/new">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Plus size={20} className="mr-2" />
              Thêm sản phẩm
            </Button>
          </Link>
        </div>

        {/* Search + Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-4 mb-6">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-xs">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-3 text-orange-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên hoặc thương hiệu..."
                  className="w-full pl-10 pr-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <select
              className="px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tất cả sản phẩm</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm border border-orange-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-orange-100 border-b border-orange-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900">
                    Danh mục
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900">
                    Giá
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900">
                    Tồn kho
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900">
                    Đánh giá
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-orange-900">
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.productId}
                    className="border-b border-orange-100 hover:bg-orange-50 transition"
                  >
                    {/* Product */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover bg-orange-100"
                        />

                        <div>
                          <p className="font-medium text-orange-900">
                            {product.name}
                          </p>
                          <p className="text-sm text-orange-600">
                            {product.brand}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 text-orange-700">
                      {product.categoryName}
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 font-semibold text-orange-900">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(product.price || 0)}
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${product.stockQuantity > 20
                          ? 'bg-green-100 text-green-700'
                          : product.stockQuantity > 0
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                          }`}
                      >
                        {product.stockQuantity} sản phẩm
                      </span>
                    </td>

                    {/* Rating */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium text-orange-900">
                          {product.avgRating?.toFixed(1) || 0}
                        </span>
                        <span className="text-sm text-orange-600">
                          ({product.reviewCount || 0})
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${product.active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                          }`}
                      >
                        {product.active ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <Link href={`/vendor/products/${product.productId}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-orange-600 hover:bg-orange-100"
                          >
                            <Eye size={18} />
                          </Button>
                        </Link>

                        <Link
                          href={`/vendor/products/${product.productId}/edit`}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:bg-blue-100"
                          >
                            <Edit2 size={18} />
                          </Button>
                        </Link>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-100"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-orange-700 text-lg">
                Không tìm thấy sản phẩm nào
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}