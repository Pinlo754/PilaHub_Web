'use client'

import { VendorSidebar } from '@/components/vendor-sidebar'
import { VendorHeader } from '@/components/vendor-header'
import { Card } from '@/components/ui/card'
import { Search, Eye, Inbox } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { OrderService } from '@/hooks/order.service'

// Khớp với giá trị đã map bằng mapStatus bên dưới
const statuses = {
  'Chờ xác nhận': 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  'Đang xử lý': 'bg-orange-100 text-orange-700 border border-orange-200',
  'Đã hoàn tiền': 'bg-green-100 text-green-700 border border-green-200',
  'Từ chối': 'bg-red-100 text-red-700 border border-red-200',
}

const mapStatus = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'Chờ xác nhận'
    case 'APPROVED':
      return 'Đã xác nhận'
    case 'COMPLETED':
      return 'Đã hoàn tiền'
    case 'REJECTED':
      return 'Từ chối'
    default:
      return status
  }
}

export default function VendorReturns() {
  const [returns, setReturns] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  const formatDate = (date: string) => {
    if (!date) return '---'
    return new Date(date).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        setLoading(true)
        // Lấy vendorId từ localStorage giống logic phân quyền của bạn
        const vendorId = typeof window !== 'undefined' ? localStorage.getItem('vendorId') : null

        // Gọi API lấy danh sách đơn trả hàng thực tế
        const res = await OrderService.getMyReturn()

        if (res.success && res.data) {
          const mappedData = res.data.map((item: any) => {
            // Tính tổng tiền hoàn lại từ danh sách itemReturns con bên trong
            const totalRefund = item.itemReturns?.reduce((sum: number, i: any) => sum + (i.refundAmount || 0), 0) || 0

            return {
              id: item.returnId,
              orderId: item.orderId,
              status: mapStatus(item.status),
              reason: item.reason || 'Không có lý do',
              amount: totalRefund,
              date: formatDate(item.createdAt),
              // Nếu API thực tế không có customer ở tầng này, ta hiển thị tạm hoặc bổ sung sau
              customer: item.customerName || 'Khách hàng',
              email: item.customerEmail || '---'
            }
          })
          setReturns(mappedData)
        }
      } catch (err) {
        console.error('Lỗi khi tải danh sách trả hàng:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReturns()
  }, [])

  // Xử lý bộ lọc tìm kiếm theo Mã trả hàng hoặc Mã đơn hàng
  const filteredReturns = returns.filter((item) =>
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.orderId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-orange-50">
      <VendorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <VendorHeader title="Trả hàng" />
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">

            {/* Search Input */}
            <div className="flex items-center gap-2 bg-white rounded-lg border border-orange-200 px-4 shadow-sm">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã trả hàng hoặc mã đơn gốc..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 py-2.5 outline-none text-sm bg-transparent"
              />
            </div>

            {/* Status Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-2 border-yellow-100 p-4 bg-white shadow-sm">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Chờ xác nhận</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {returns.filter(r => r.status === 'Chờ xác nhận').length}
                </p>
              </Card>
              <Card className="border-2 border-orange-100 p-4 bg-white shadow-sm">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Đang xử lý</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {returns.filter(r => r.status === 'Đang xử lý').length}
                </p>
              </Card>
              <Card className="border-2 border-green-100 p-4 bg-white shadow-sm">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Đã hoàn tiền</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {returns.filter(r => r.status === 'Đã hoàn tiền').length}
                </p>
              </Card>
              <Card className="border-2 border-red-100 p-4 bg-white shadow-sm">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Từ chối</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {returns.filter(r => r.status === 'Từ chối').length}
                </p>
              </Card>
            </div>

            {/* Main Content Area (Table or Empty State) */}
            <Card className="border-2 border-orange-200 p-6 bg-white shadow-sm rounded-xl">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500 space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  <span className="text-sm">Đang tải danh sách yêu cầu...</span>
                </div>
              ) : filteredReturns.length === 0 ? (

                /* === EMPTY STATE VIEW === */
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="p-4 bg-orange-50 rounded-full text-orange-400 mb-4 border border-orange-100">
                    <Inbox size={40} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Không tìm thấy yêu cầu nào</h3>
                  <p className="text-sm text-gray-500 max-w-sm mt-1">
                    {searchTerm
                      ? "Không tìm thấy dữ liệu nào trùng khớp với từ khóa tìm kiếm của bạn."
                      : "Hiện tại gian hàng của bạn chưa nhận được bất kỳ yêu cầu hoàn tiền / trả hàng nào từ người mua."}
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="mt-4 px-4 py-2 text-xs font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition"
                    >
                      Xóa bộ lọc tìm kiếm
                    </button>
                  )}
                </div>

              ) : (

                /* === TABLE VIEW === */
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-orange-200 text-gray-400 text-xs tracking-wider uppercase bg-orange-50/50">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 rounded-l-lg">Mã trả</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Mã đơn gốc</th>
                        
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Lý do hoàn trả</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Số tiền hoàn</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Ngày yêu cầu</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Trạng thái</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700 rounded-r-lg">Chi tiết</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredReturns.map((returnItem) => (
                        <tr key={returnItem.id} className="hover:bg-orange-50/40 transition-colors">
                          <td className="py-3.5 px-4 font-medium text-gray-900 max-w-[150px] truncate" title={returnItem.id}>
                            #{returnItem.id.slice(0, 8)}...
                          </td>
                          <td className="py-3.5 px-4 text-gray-500 font-mono text-xs" title={returnItem.orderId}>
                            {returnItem.orderId.slice(0, 8)}...
                          </td>
                          <td className="py-3.5 px-4 text-gray-600 max-w-[200px] truncate" title={returnItem.reason}>
                            {returnItem.reason}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-orange-600">
                            {returnItem.amount.toLocaleString('vi-VN')}đ
                          </td>
                          <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                            {returnItem.date}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statuses[returnItem.status as keyof typeof statuses] || 'bg-gray-100 text-gray-700'}`}>
                              {returnItem.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <Link
                              href={`/vendor/returns/${returnItem.id}`}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition inline-block border border-transparent hover:border-blue-100"
                            >
                              <Eye size={16} />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
}