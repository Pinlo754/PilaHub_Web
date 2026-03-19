'use client'

import Link from 'next/link'
import { Package, Pill, Plus, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VendorSidebar } from '@/components/vendor-sidebar'
import { useEffect, useState } from "react"
import { ProductService } from "@/hooks/product.service"
import { SupplementService } from "@/hooks/supplement.service"
export default function InventoryPage() {
  
  const [products, setProducts] = useState<any[]>([])
  const [supplements, setSupplements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const vendorId =
        typeof window !== 'undefined' ? localStorage.getItem('id') : null

      if (!vendorId) {
        setLoading(false)
        return
      }

      try {
        const [productRes, supplementRes] = await Promise.all([
          ProductService.getMyProduct(vendorId),
          SupplementService.getMySupplement(vendorId)
        ])

        if (productRes?.success) {
          setProducts(productRes.data.content || [])
        }

        if (supplementRes?.success) {
          setSupplements(supplementRes.data || [])
        }

      } catch (err) {
        console.error("Fetch inventory error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const totalProducts = products.length
  const activeProducts = totalProducts
  const lowStockProducts = products.filter(p => p.stockQuantity < 5).length

  const totalSupplements = supplements.length
  const activeSupplements = supplements.filter(s => s.active).length

  const stats = [
  {
    title: 'Tổng sản phẩm',
    value: totalProducts,
    change: '',
    link: '/vendor/products',
    icon: Package,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Chất bổ sung',
    value: totalSupplements,
    change: '',
    link: '/vendor/supplements',
    icon: Pill,
    color: 'bg-green-100 text-green-600',
  },
  {
    title: 'Tồn kho thấp',
    value: lowStockProducts,
    change: '',
    link: '/vendor/products?stock=low',
    color: 'bg-red-100 text-red-600',
  },
  {
    title: 'Đang hoạt động',
    value: activeProducts + activeSupplements,
    change: '',
    link: '#',
    color: 'bg-purple-100 text-purple-600',
  },
]


  return (
    <div className="flex min-h-screen bg-orange-50">
      <VendorSidebar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-orange-900">Quản lý kho hàng</h1>
          <p className="text-orange-700 mt-1">Quản lý toàn bộ sản phẩm và chất bổ sung của cửa hàng</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon || TrendingUp
            return (
              <Link key={index} href={stat.link || '#'}>
                <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-6 hover:shadow-md transition cursor-pointer">
                  <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
                    <Icon size={24} />
                  </div>
                  <p className="text-orange-600 text-sm font-medium mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold text-orange-900 mb-2">{stat.value}</p>
                  <p className="text-xs text-orange-600">{stat.change}</p>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-2 gap-8">
          {/* Products Section */}
          <div className="bg-white rounded-lg shadow-sm border border-orange-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Sản phẩm</h2>
                  <p className="text-blue-100 mt-1">Quản lý sản phẩm chính của bạn</p>
                </div>
                <Package size={40} className="opacity-20" />
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="text-orange-700 font-medium">Tổng sản phẩm</span>
                  <span className="text-2xl font-bold text-orange-900">{totalProducts}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-green-700 font-medium">Đang hoạt động</span>
                  <span className="text-2xl font-bold text-green-900">{activeProducts}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-red-700 font-medium">Tồn kho thấp</span>
                  <span className="text-2xl font-bold text-red-900">{lowStockProducts}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Link href="/vendor/products" className="flex-1">
                  <Button variant="outline" className="w-full border-blue-300 text-blue-600 hover:bg-blue-50">
                    Xem danh sách
                  </Button>
                </Link>
                <Link href="/vendor/products/new">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus size={18} className="mr-2" />
                    Thêm
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Supplements Section */}
          <div className="bg-white rounded-lg shadow-sm border border-orange-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Chất bổ sung</h2>
                  <p className="text-green-100 mt-1">Quản lý chất bổ sung sức khỏe</p>
                </div>
                <Pill size={40} className="opacity-20" />
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="text-orange-700 font-medium">Tổng chất bổ sung</span>
                  <span className="text-2xl font-bold text-orange-900">{totalSupplements}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-green-700 font-medium">Đang hoạt động</span>
                  <span className="text-2xl font-bold text-green-900">{activeSupplements}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-purple-700 font-medium">Bán chạy nhất</span>
                  <span className="text-2xl font-bold text-purple-900">5</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Link href="/vendor/supplements" className="flex-1">
                  <Button variant="outline" className="w-full border-green-300 text-green-600 hover:bg-green-50">
                    Xem danh sách
                  </Button>
                </Link>
                <Link href="/vendor/supplements/new">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Plus size={18} className="mr-2" />
                    Thêm
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-orange-200 p-6">
          <h3 className="text-xl font-semibold text-orange-900 mb-6">Hoạt động gần đây</h3>

          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Package size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-orange-900">Sản phẩm "Professional Pilates Mat" được cập nhật</p>
                    <p className="text-sm text-orange-600">2 giờ trước</p>
                  </div>
                </div>
                <span className="text-orange-600 font-medium">Chỉnh sửa</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
