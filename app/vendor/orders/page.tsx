'use client'

import { useState, useEffect } from 'react'
import { VendorSidebar } from '@/components/vendor-sidebar'
import { VendorHeader } from '@/components/vendor-header'
import { Card } from '@/components/ui/card'
import { Search, Eye } from 'lucide-react'
import Link from 'next/link'
import { OrderService } from '@/hooks/order.service'

const mockOrders = [
  {
    id: 'a01234',
    customer: 'Nguyễn Văn A',
    email: 'nguyenvana@gmail.com',
    status: 'chờ xác nhận',
    method: 'PilaPay',
    amount: 565000,
    date: '04/12/2025',
  },
]

const statuses: any = {
  'chờ xác nhận': 'bg-yellow-100 text-yellow-700',
  'đang giao': 'bg-blue-100 text-blue-700',
  'hoàn thành': 'bg-green-100 text-green-700',
  'bị hủy': 'bg-red-100 text-red-700',
}

export default function VendorOrders() {

  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const mapStatus = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ xác nhận'
      case 'PROCESSING':
        return 'Đang giao'
      case 'COMPLETED':
        return 'Hoàn thành'
      case 'CANCELLED':
        return 'Bị hủy'
      default:
        return status
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('vi-VN')
  }

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const vendorId =
          typeof window !== 'undefined'
            ? localStorage.getItem('id')
            : null

        if (!vendorId) {
          setLoading(false)
          return
        }

        const res = await OrderService.getMyOrders(vendorId)

        if (res.success && res.data?.length > 0) {

          const mapped = res.data.map((order: any) => ({
            id: order.orderId, // hoặc orderId
            customer: order.recipientName,
            email: order.recipientPhone, // API không có email → tạm dùng phone
            method: order.paymentMethod,
            amount: order.totalAmount,
            date: formatDate(order.createdAt),
            status: mapStatus(order.status),
          }))

          setOrders(mapped)

        } else {
          setOrders(mockOrders)
        }


      } catch (error) {
        console.error('Fetch orders error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()

  }, [])

  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const filteredOrders = orders.filter((order) => {
    const keyword = debouncedSearch.toLowerCase()

    return (
      order.customer?.toLowerCase().includes(keyword) ||
      order.id?.toLowerCase().includes(keyword) ||
      order.email?.toLowerCase().includes(keyword)
    )
  })

  if (loading) {
    return (
      <div className="flex min-h-screen bg-orange-50">
        <VendorSidebar />
        <div className="flex items-center justify-center w-full">
          <p className="text-lg text-orange-700">Đang tải đơn hàng...</p>
        </div>
      </div>
    )
  }

  {
    filteredOrders.length === 0 && (
      <tr>
        <td colSpan={8} className="text-center py-6 text-gray-500">
          Không tìm thấy đơn hàng
        </td>
      </tr>
    )
  }

  return (
    <div className="flex h-screen bg-orange-50">
      <VendorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <VendorHeader title="Đơn hàng" />
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Search */}
            <div className="flex items-center gap-2 bg-white rounded-lg border border-orange-200 px-4">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo mã đơn, tên khách, email..."
                className="flex-1 py-2 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card className="border-2 border-orange-200 p-4">
                <p className="text-gray-600 text-sm">Chờ xác nhận</p>
                <p className="text-2xl font-bold text-orange-600">57</p>
              </Card>
              <Card className="border-2 border-blue-200 p-4">
                <p className="text-gray-600 text-sm">Đang giao</p>
                <p className="text-2xl font-bold text-blue-600">93</p>
              </Card>
              <Card className="border-2 border-green-200 p-4">
                <p className="text-gray-600 text-sm">Hoàn thành</p>
                <p className="text-2xl font-bold text-green-600">326</p>
              </Card>
              <Card className="border-2 border-red-200 p-4">
                <p className="text-gray-600 text-sm">Bị hủy</p>
                <p className="text-2xl font-bold text-red-600">34</p>
              </Card>
              <Card className="border-2 border-purple-200 p-4">
                <p className="text-gray-600 text-sm">Chờ trả hàng</p>
                <p className="text-2xl font-bold text-purple-600">12</p>
              </Card>
            </div>

            {/* Orders Table */}
            <Card className="border-2 border-orange-200 p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-orange-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Mã đơn</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Tên khách hàng</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Phương thức thanh toán</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Tiền</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Ngày đặt</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Trạng thái</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-orange-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{order.id}</td>
                        <td className="py-3 px-4 text-gray-600">{order.customer}</td>
                        <td className="py-3 px-4 text-gray-600">{order.email}</td>
                        <td className="py-3 px-4 text-gray-600">{order.method}</td>
                        <td className="py-3 px-4 font-semibold text-orange-600">{order.amount.toLocaleString()}đ</td>
                        <td className="py-3 px-4 text-gray-600">{order.date}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statuses[order.status as keyof typeof statuses]}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Link
                            href={`/vendor/orders/${order.id}`}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition inline-block"
                          >
                            <Eye size={16} />
                          </Link>
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
