'use client'

import { useState, useEffect, useMemo } from 'react'
import { VendorSidebar } from '@/components/vendor-sidebar'
import { VendorHeader } from '@/components/vendor-header'
import { Card } from '@/components/ui/card'
import { Search, Eye, Inbox, Copy, Check } from 'lucide-react'
import Link from 'next/link'
import { OrderService } from '@/hooks/order.service'

const statuses: Record<string, string> = {
  'Chờ xác nhận': 'bg-yellow-100 text-yellow-700',
  'Đã xác nhận': 'bg-orange-100 text-orange-700',
  'Đang trong quá trình giao': 'bg-blue-100 text-blue-700',
  'Hoàn thành': 'bg-green-100 text-green-700',
  'Đã hủy': 'bg-red-100 text-red-700',
  'Trả hàng / Hoàn tiền': 'bg-purple-100 text-purple-700',
}

export default function VendorOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  
  // State quản lý ID đơn hàng vừa được copy để hiển thị hiệu ứng tích xanh (Check icon)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // 1. Hàm rút gọn mã UUID đơn hàng (Lấy 6 ký tự đầu)
  const truncateUUID = (uuid: string) => {
    if (!uuid) return '---'
    if (uuid.length <= 8) return uuid
    return `${uuid.substring(0, 6)}...`
  }

  // 2. Hàm xử lý Click để Copy mã đơn hàng đầy đủ vào Clipboard
  const handleCopyId = async (fullUuid: string) => {
    try {
      await navigator.clipboard.writeText(fullUuid)
      setCopiedId(fullUuid)
      // Tự động tắt trạng thái tích xanh sau 2 giây
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Không thể copy mã đơn:', err)
    }
  }

  const mapStatus = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Chờ xác nhận'
      case 'CONFIRMED': return 'Đã xác nhận'
      case 'COMPLETED': return 'Hoàn thành'
      case 'CANCELLED': return 'Đã hủy'
      case 'RETURNED':
      case 'REFUNDED': return 'Trả hàng / Hoàn tiền'
      default: return 'Đang trong quá trình giao'
    }
  }

  const formatDate = (date: string) => {
    if (!date) return '---'
    return new Date(date).toLocaleString('vi-VN')
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const vendorId = typeof window !== 'undefined' ? localStorage.getItem('id') : null
        if (!vendorId) {
          setLoading(false)
          return
        }
        const res = await OrderService.getMyOrders(vendorId)
        if (res.success && res.data?.length > 0) {
          const mapped = res.data.map((order: any) => ({
            id: order.orderId,
            customer: order.recipientName || 'Khách vãng lai',
            email: order.recipientPhone || '---', 
            method: order.paymentMethod || 'COD',
            amount: order.totalAmount || 0,
            date: formatDate(order.createdAt),
            status: mapStatus(order.status),
          }))
          setOrders(mapped)
        }
      } catch (error) {
        console.error('Fetch orders error:', error)
      } {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const statusCounts = useMemo(() => {
    return orders.reduce(
      (acc, order) => {
        if (order.status === 'Chờ xác nhận') acc.pending++
        else if (order.status === 'Đã xác nhận') acc.confirmed++
        else if (order.status === 'Đang trong quá trình giao') acc.processing++
        else if (order.status === 'Hoàn thành') acc.completed++
        else if (order.status === 'Đã hủy') acc.cancelled++
        else if (order.status === 'Trả hàng / Hoàn tiền') acc.returned++
        return acc
      },
      { pending: 0, confirmed: 0, processing: 0, completed: 0, cancelled: 0, returned: 0 }
    )
  }, [orders])

  const filteredOrders = useMemo(() => {
    const keyword = debouncedSearch.toLowerCase().trim()
    if (!keyword) return orders
    return orders.filter((order) => {
      return (
        order.customer?.toLowerCase().includes(keyword) ||
        order.id?.toLowerCase().includes(keyword) ||
        order.email?.toLowerCase().includes(keyword)
      )
    })
  }, [debouncedSearch, orders])

  if (loading) {
    return (
      <div className="flex min-h-screen bg-orange-50">
        <VendorSidebar />
        <div className="flex items-center justify-center w-full">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-lg text-orange-700 font-medium">Đang tải dữ liệu đơn hàng...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-orange-50">
      <VendorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <VendorHeader title="Đơn hàng" />
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            
            {/* Search Input */}
            <div className="flex items-center gap-2 bg-white rounded-lg border border-orange-200 px-4 shadow-sm focus-within:border-orange-500 transition-colors">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo mã đơn (nhập mã đầy đủ), tên khách..."
                className="flex-1 py-2 text-sm outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card className="border-2 border-yellow-200 p-4 bg-white shadow-sm">
                <p className="text-gray-500 text-xs font-medium uppercase">Chờ xác nhận</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{statusCounts.pending}</p>
              </Card>
              <Card className="border-2 border-orange-200 p-4 bg-white shadow-sm">
                <p className="text-gray-500 text-xs font-medium uppercase">Đã xác nhận</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">{statusCounts.confirmed}</p>
              </Card>
              <Card className="border-2 border-blue-200 p-4 bg-white shadow-sm">
                <p className="text-gray-500 text-xs font-medium uppercase">Đang giao hàng</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{statusCounts.processing}</p>
              </Card>
              <Card className="border-2 border-green-200 p-4 bg-white shadow-sm">
                <p className="text-gray-500 text-xs font-medium uppercase">Hoàn thành</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{statusCounts.completed}</p>
              </Card>
              <Card className="border-2 border-red-200 p-4 bg-white shadow-sm">
                <p className="text-gray-500 text-xs font-medium uppercase">Đã hủy</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{statusCounts.cancelled}</p>
              </Card>
              <Card className="border-2 border-purple-200 p-4 bg-white shadow-sm">
                <p className="text-gray-500 text-xs font-medium uppercase">Trả hàng/Hoàn tiền</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{statusCounts.returned}</p>
              </Card>
            </div>

            {/* Orders Table */}
            <Card className="border-2 border-orange-200 p-6 bg-white shadow-md rounded-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-orange-100 text-gray-700">
                      <th className="text-left py-3 px-4 font-semibold">Mã đơn</th>
                      <th className="text-left py-3 px-4 font-semibold">Tên khách hàng</th>
                      <th className="text-left py-3 px-4 font-semibold">Số điện thoại</th>
                      <th className="text-left py-3 px-4 font-semibold">Thanh toán</th>
                      <th className="text-left py-3 px-4 font-semibold">Tổng tiền</th>
                      <th className="text-left py-3 px-4 font-semibold">Ngày đặt</th>
                      <th className="text-left py-3 px-4 font-semibold">Trạng thái</th>
                      <th className="text-center py-3 px-4 font-semibold">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-12 text-gray-400">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <Inbox size={40} className="text-orange-200" />
                            <p className="text-base font-medium text-gray-500">Bạn chưa có đơn hàng nào</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order, index) => (
                        <tr key={order.id || index} className="border-b border-gray-100 hover:bg-orange-50/50 transition-colors">
                          
                          {/* CẬP NHẬT: Ô hiển thị Mã đơn kèm hiệu ứng Copy */}
                          <td className="py-3 px-4">
                            <button
                              type="button"
                              onClick={() => handleCopyId(order.id)}
                              className="group inline-flex items-center gap-1.5 font-mono font-bold text-gray-900 bg-gray-50 hover:bg-orange-100 px-2 py-1 rounded border border-gray-200 transition-all shadow-sm active:scale-95"
                              title="Click để sao chép mã đơn đầy đủ"
                            >
                              <span>{truncateUUID(order.id)}</span>
                              
                              {/* Đổi icon động khi trạng thái đã được copy thành công */}
                              {copiedId === order.id ? (
                                <Check size={13} className="text-green-600 animate-bounce" />
                              ) : (
                                <Copy size={13} className="text-gray-400 group-hover:text-orange-600 transition-colors" />
                              )}
                            </button>
                          </td>

                          <td className="py-3 px-4 text-gray-700 font-medium">{order.customer}</td>
                          <td className="py-3 px-4 text-gray-600">{order.email}</td>
                          <td className="py-3 px-4 text-gray-600">
                            <span className="uppercase text-xs bg-gray-100 px-2 py-1 rounded font-mono font-medium">
                              {order.method}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-orange-600">
                            {order.amount.toLocaleString('vi-VN')}đ
                          </td>
                          <td className="py-3 px-4 text-gray-500 text-xs">{order.date}</td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statuses[order.status] || 'bg-gray-100 text-gray-600'}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Link
                              href={`/vendor/orders/${order.id}`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition inline-flex items-center justify-center border border-blue-100 shadow-sm"
                              title="Xem chi tiết"
                            >
                              <Eye size={16} />
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
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