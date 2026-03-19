'use client'

import { VendorSidebar } from '@/components/vendor-sidebar'
import { VendorHeader } from '@/components/vendor-header'
import { Card } from '@/components/ui/card'
import { Search, Eye } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { OrderService } from '@/hooks/order.service'

const statuses = {
  'chờ xác nhận': 'bg-yellow-100 text-yellow-700',
  'Đang hoàn về': 'bg-green-100 text-green-700',
  'Đã hoàn tiền': 'bg-blue-100 text-blue-700',
  'từ chối': 'bg-red-100 text-red-700',
}

const mapStatus = (status: string) => {
  switch (status) {
    case 'RETURNED':
      return 'Đang hoàn về'
    case 'REFUNDED':
      return 'Đã hoàn tiền'
    case 'CANCELLED':
      return 'từ chối'
    default:
      return status.toLowerCase()
  }
}

export default function VendorReturns() {

  const [returns, setReturns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN')
  }

  useEffect(() => {

    const fetchOrders = async () => {
      const vendorId =
          typeof window !== 'undefined'
            ? localStorage.getItem('id')
            : null

        if (!vendorId) {
          setLoading(false)
          return
        }

        const res = await OrderService.getMyOrders(vendorId)

      if (res.success && res.data) {

        const filtered = res.data
          .filter((o: any) =>
            ['RETURNED', 'REFUNDED'].includes(o.status)
          )
          .map((o: any) => ({
            id: o.orderNumber,
            orderId: o.orderId,
            customer: o.recipientName,
            email: o.recipientPhone, // API chưa có
            status: mapStatus(o.status),
            amount: o.totalAmount,
            date: formatDate(o.createdAt),
            reason: o.cancellationReason || 'Không có'
          }))

        setReturns(filtered)
      }
    }

    fetchOrders()

  }, [])

  return (
    <div className="flex h-screen bg-orange-50">
      <VendorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <VendorHeader title="Trả hàng" />
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">

            {/* Search */}
            <div className="flex items-center gap-2 bg-white rounded-lg border border-orange-200 px-4">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Tìm đơn trả hàng..."
                className="flex-1 py-2 outline-none"
              />
            </div>

            {/* Status Cards (có thể tính dynamic sau) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-2 border-yellow-200 p-4">
                <p className="text-gray-600 text-sm">Chờ xác nhận</p>
                <p className="text-2xl font-bold text-yellow-600">0</p>
              </Card>
              <Card className="border-2 border-green-200 p-4">
                <p className="text-gray-600 text-sm">Đang hoàn về</p>
                <p className="text-2xl font-bold text-green-600">
                  {returns.filter(r => r.status === 'Đang hoàn về').length}
                </p>
              </Card>
              <Card className="border-2 border-blue-200 p-4">
                <p className="text-gray-600 text-sm">Đã hoàn tiền</p>
                <p className="text-2xl font-bold text-blue-600">
                  {returns.filter(r => r.status === 'Đã hoàn tiền').length}
                </p>
              </Card>
              <Card className="border-2 border-red-200 p-4">
                <p className="text-gray-600 text-sm">Từ chối</p>
                <p className="text-2xl font-bold text-red-600">
                  {returns.filter(r => r.status === 'từ chối').length}
                </p>
              </Card>
            </div>

            {/* Table */}
            <Card className="border-2 border-orange-200 p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-orange-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Mã trả</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Mã đơn</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Khách hàng</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Lý do</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Tiền</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Ngày yêu cầu</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Trạng thái</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {returns.map((returnItem, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-orange-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{returnItem.id}</td>
                        <td className="py-3 px-4 text-gray-600">{returnItem.orderId}</td>
                        <td className="py-3 px-4 text-gray-600">{returnItem.customer}</td>
                        <td className="py-3 px-4 text-gray-600">{returnItem.email}</td>
                        <td className="py-3 px-4 text-gray-600">{returnItem.reason}</td>
                        <td className="py-3 px-4 font-semibold text-orange-600">
                          {returnItem.amount.toLocaleString()}đ
                        </td>
                        <td className="py-3 px-4 text-gray-600">{returnItem.date}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statuses[returnItem.status as keyof typeof statuses]}`}>
                            {returnItem.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Link
                            href={`/vendor/returns/${returnItem.id}`}
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