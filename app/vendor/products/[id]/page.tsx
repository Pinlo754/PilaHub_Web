'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Edit2, Share2, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VendorSidebar } from '@/components/vendor-sidebar'
import { ProductService } from '@/hooks/product.service'
import { useParams } from 'next/navigation'
const mockProduct = {
  productId: "123e4567-e89b-12d3-a456-426614174000",
  vendorId: "123e4567-e89b-12d3-a456-426614174000",
  vendorBusinessName: "Pilates Pro Shop",
  categoryId: "123e4567-e89b-12d3-a456-426614174000",
  categoryName: "Pilates Product",
  name: "Professional Pilates Mat",
  description: "High-quality non-slip Pilates mat perfect for yoga, pilates, and fitness training",
  imageUrl: "https://via.placeholder.com/400x300",
  price: 59.99,
  stockQuantity: 100,
  brand: "MatPro",
  specifications: "180cm x 60cm, 6mm thickness, TPE material, eco-friendly",
  avgRating: 4.5,
  reviewCount: 25,
  active: true,
  createdAt: "2026-01-23T10:30:00Z",
  updatedAt: "2026-01-23T10:30:00Z"
}

const stats = [
  { label: 'Lượt xem', value: '1,234' },
  { label: 'Lượt thích', value: '456' },
  { label: 'Bình luận', value: '78' },
  { label: 'Đã bán', value: '234' },
]

const reviews = [
  {
    id: 1,
    author: 'Nguyễn Văn A',
    rating: 5,
    date: '2026-02-10',
    text: 'Sản phẩm tuyệt vời, chất lượng rất tốt!',
    verified: true
  },
  {
    id: 2,
    author: 'Trần Thị B',
    rating: 4,
    date: '2026-02-08',
    text: 'Rất hài lòng, giao hàng nhanh.',
    verified: true
  },
]

export default function ProductDetailPage() {

  const params = useParams()
  const id = params?.id as string
  const [activeTab, setActiveTab] = useState('overview')
  const [product, setProduct] = useState<any>(mockProduct)

  useEffect(() => {
    if (!id) return

    const fetchProduct = async () => {
      try {
        const res = await ProductService.getProductById(id)

        if (res.success && res.data) {
          setProduct(res.data)
        } else {
          setProduct(mockProduct)
        }

      } catch (err) {
        console.error("Fetch product error:", err)
        setProduct(mockProduct)
      }
    }

    fetchProduct()
  }, [id])

  return (
    <div className=" flex min-h-screen bg-orange-50">
      <VendorSidebar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/vendor/products" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-4">
            <ArrowLeft size={20} />
            <span>Quay lại</span>
          </Link>
        </div>

        {/* Product Header */}
        <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-6 mb-8">
          <div className="flex gap-8">
            <div className="flex-shrink-0">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-64 h-64 rounded-lg object-cover bg-orange-100"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-orange-900 mb-2">{product.name}</h1>
                  <p className="text-orange-600 text-lg font-semibold">{product.brand}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical size={20} className="text-orange-600" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-orange-600 mb-1">Giá</p>
                  <p className="text-2xl font-bold text-green-600">{new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(product.price || 0)}</p>
                </div>
                <div>
                  <p className="text-sm text-orange-600 mb-1">Tồn kho</p>
                  <p className="text-2xl font-bold text-orange-900">{product.stockQuantity} sản phẩm</p>
                </div>
                <div>
                  <p className="text-sm text-orange-600 mb-1">Đánh giá</p>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500 text-lg">★★★★☆</span>
                    <span className="text-orange-900 font-semibold">{product.avgRating?.toFixed(1)}/5</span>
                    <span className="text-orange-600">({product.reviewCount} đánh giá)</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-orange-600 mb-1">Trạng thái</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${product.active
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                    }`}>
                    {product.active ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </div>
              </div>

              <p className="text-orange-700 mb-6 leading-relaxed">{product.description}</p>

              <div className="flex gap-3">
                <Link href={`/vendor/products/${product.productId}/edit`}>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Edit2 size={20} className="mr-2" />
                    Chỉnh sửa sản phẩm
                  </Button>
                </Link>
                <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                  <Share2 size={20} className="mr-2" />
                  Chia sẻ
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-orange-200 p-4 text-center">
              <p className="text-orange-600 text-sm font-medium mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-orange-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-orange-200">
          <div className="flex border-b border-orange-200">
            {['overview', 'reviews', 'details'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium border-b-2 transition ${activeTab === tab
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-orange-700 hover:text-orange-600'
                  }`}
              >
                {tab === 'overview' && 'Tổng quan'}
                {tab === 'reviews' && 'Đánh giá'}
                {tab === 'details' && 'Chi tiết'}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-lg font-semibold text-orange-900 mb-4">Mô tả sản phẩm</h3>
                <p className="text-orange-700 leading-relaxed mb-6">{product.description}</p>
                <h3 className="text-lg font-semibold text-orange-900 mb-4">Thông số kỹ thuật</h3>
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-orange-700">{product.specifications}</p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-lg font-semibold text-orange-900 mb-6">Đánh giá từ khách hàng</h3>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-orange-100 pb-6 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-orange-900">{review.author}</p>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                            {review.verified && <span className="text-green-600">✓ Đã xác minh</span>}
                          </div>
                        </div>
                        <span className="text-sm text-orange-600">{review.date}</span>
                      </div>
                      <p className="text-orange-700">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-orange-600 font-medium mb-1">Danh mục</p>
                  <p className="text-orange-900">{product.categoryName}</p>
                </div>
                <div>
                  <p className="text-sm text-orange-600 font-medium mb-1">Thương hiệu</p>
                  <p className="text-orange-900">{product.brand}</p>
                </div>
                <div>
                  <p className="text-sm text-orange-600 font-medium mb-1">Ngày tạo</p>
                  <p className="text-orange-900">{new Date(product.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
                <div>
                  <p className="text-sm text-orange-600 font-medium mb-1">Cập nhật lần cuối</p>
                  <p className="text-orange-900">{new Date(product.updatedAt).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
