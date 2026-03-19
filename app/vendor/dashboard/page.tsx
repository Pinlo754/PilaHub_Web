'use client'

import { useEffect, useState } from 'react'
import { VendorSidebar } from '@/components/vendor-sidebar'
import { VendorHeader } from '@/components/vendor-header'
import { Card } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'
import { ShoppingCart, Package, RotateCcw, TrendingUp } from 'lucide-react'
import { DashboardService } from '@/hooks/dashboard.service'

export default function VendorDashboard() {
  const [dashboard, setDashboard] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // input
  const [startDate, setStartDate] = useState('2026-01-01')
  const [endDate, setEndDate] = useState('2026-03-17')

  // applied (chỉ dùng để call API)
  const [appliedStartDate, setAppliedStartDate] = useState('2026-01-01')
  const [appliedEndDate, setAppliedEndDate] = useState('2026-03-17')

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)

        const res = await DashboardService.getDashboard({
          startDate: appliedStartDate,
          endDate: appliedEndDate,
        })

        if (res.success) {
          setDashboard(res.data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [appliedStartDate, appliedEndDate])

  const formatCurrency = (value: number) =>
    value?.toLocaleString('vi-VN') + 'đ'

  const revenueData = Object.entries(dashboard?.dailyRevenue || {}).map(
    ([date, revenue]: any) => ({
      name: new Date(date).toLocaleDateString('vi-VN'),
      revenue,
    })
  )

  const orderData = Object.entries(dashboard?.dailyOrders || {}).map(
    ([date, order]: any) => ({
      name: new Date(date).toLocaleDateString('vi-VN'),
      order,
    })
  )

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="flex h-screen bg-orange-50">
      <VendorSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <VendorHeader title="Dashboard" />

        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">

            {/* Date Filter */}
            <div className="flex justify-end gap-2 items-center">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-1 border border-orange-200 rounded-lg text-sm"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-1 border border-orange-200 rounded-lg text-sm"
              />

              <button
                onClick={() => {
                  setAppliedStartDate(startDate)
                  setAppliedEndDate(endDate)
                }}
                disabled={loading}
                className="px-4 py-1 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 disabled:opacity-50"
              >
                {loading ? 'Đang lọc...' : 'Lọc'}
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-2 border-orange-200 p-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Doanh thu</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {formatCurrency(dashboard?.netRevenue)}
                    </p>
                  </div>
                  <TrendingUp className="text-green-600" />
                </div>
              </Card>

              <Card className="border-2 border-orange-200 p-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Đơn hàng</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {dashboard?.totalOrders}
                    </p>
                  </div>
                  <ShoppingCart className="text-blue-600" />
                </div>
              </Card>

              <Card className="border-2 border-orange-200 p-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Sản phẩm</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {dashboard?.productPerformance?.length}
                    </p>
                  </div>
                  <Package className="text-purple-600" />
                </div>
              </Card>

              <Card className="border-2 border-orange-200 p-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Trả hàng</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {dashboard?.orderStatusDistribution?.CANCELLED || 0}
                    </p>
                  </div>
                  <RotateCcw className="text-red-600" />
                </div>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-2 border-orange-200 p-6">
                <h3 className="mb-4 font-semibold">Doanh thu</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#f97316" fill="#fed7aa" />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              <Card className="border-2 border-orange-200 p-6">
                <h3 className="mb-4 font-semibold">Đơn hàng</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={orderData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="order" stroke="#3b82f6" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Top Products */}
            <Card className="border-2 border-orange-200 p-6">
              <h3 className="mb-4 font-semibold">Top sản phẩm</h3>
              <div className="space-y-3">
                {dashboard?.topProducts?.map((p: any) => (
                  <div key={p.productId} className="flex justify-between">
                    <div>
                      <p className="font-medium">{p.productName}</p>
                      <p className="text-sm text-gray-500">SL: {p.totalQuantity}</p>
                    </div>
                    <p className="text-orange-600 font-semibold">
                      {formatCurrency(p.totalRevenue)}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Average Order */}
            <Card className="border-2 border-orange-200 p-6">
              <h3 className="mb-2 font-semibold">Giá trị đơn trung bình</h3>
              <p className="text-2xl font-bold text-orange-600">
                {formatCurrency(dashboard?.averageOrderValue)}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
