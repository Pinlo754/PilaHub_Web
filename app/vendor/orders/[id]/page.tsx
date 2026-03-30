'use client'

import { VendorSidebar } from '@/components/vendor-sidebar'
import { VendorHeader } from '@/components/vendor-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { OrderService } from '@/hooks/order.service'
import { useRouter } from 'next/navigation'

const mockOrder = {
  id: "ORD001",
  customer: {
    name: "Nguyễn Văn A",
    phone: "0123456789",
    address: "Vinhomes Grand Park, Quận 9, TP. Thủ Đức"
  },
  paymentMethod: "PilaPay",
  status: "Chờ xác nhận",
  subtotal: 400000,
  shippingFee: 50000,
  total: 450000,
  orderTime: "07/12/2025 20h00",
  paymentTime: "07/12/2025 20h10",
  deliveryTime: "10/12/2026 10h28",
  items: [
    {
      id: "1",
      name: "Thảm yoga",
      variant: "173x61, Đỏ",
      quantity: 1,
      price: 100000,
      imageUrl: "",
      shipmentId: ""
    },
    {
      id: "2",
      name: "Dây kháng lực",
      variant: "Medium",
      quantity: 2,
      price: 150000,
      imageUrl: "",
      shipmentId: ""
    }
  ]
}

export default function OrderDetails() {

  const params = useParams()
  const id = params?.id as string
  const router = useRouter()

  const [order, setOrder] = useState<any>(null)

  const shipmentOptions = [
    'READY_TO_PICK',
    'PICKING',
    'PICKED',
    'STORING',
    'TRANSPORTING',
    'DELIVERING',
    'DELIVERED',
    'DELIVERY_FAIL',
    'RETURN',
    'RETURNING',
    'RETURNED',
    'CANCELLED',
  ]

  const mapStatus = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Chờ xác nhận'
      case 'CONFIRMED': return 'Đã xác nhận'
      case 'READY': return 'Đã đóng gói'
      case 'SHIPPED': return 'Đang vận chuyển'
      case 'DELIVERED': return 'Đã giao'
      case 'COMPLETED': return 'Hoàn thành'
      case 'CANCELLED': return 'Bị hủy'
      default: return status
    }
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleString('vi-VN')

  // ================= FETCH =================
  const fetchOrder = async () => {
    const res = await OrderService.getOrderById(id)

    if (res.success && res.data) {
      const o = res.data

      const mapped = {
        id: o.orderNumber,

        customer: {
          name: o.recipientName,
          phone: o.recipientPhone,
          address: o.shippingAddress,
        },

        paymentMethod: o.paymentMethod,
        status: mapStatus(o.status),

        shipmentStatus: o.shipments?.[0]?.status, // ✅ FIX
        shipmentId: o.shipments?.[0]?.shipmentId, // ✅ FIX

        subtotal: o.totalAmount - o.shippingFee,
        shippingFee: o.shippingFee,
        total: o.totalAmount,

        orderTime: formatDate(o.createdAt),
        paymentTime: o.paidAt ? formatDate(o.paidAt) : 'Chưa thanh toán',
        deliveryTime: o.shipments?.[0]?.deliveredAt
          ? formatDate(o.shipments[0].deliveredAt)
          : 'Chưa giao',

        items: o.orderDetails.map((item: any) => ({
          id: item.orderDetailId,
          name: item.productName,
          quantity: item.quantity,
          price: item.unitPrice,
          imageUrl: item.productImageUrl,
          installationRequest: item.installationRequest,
        })),
      }

      setOrder(mapped)
    }
  }

  useEffect(() => {
    if (id) fetchOrder()
  }, [id])

  if (!order) return null

  const hasInstallation = order.items?.some((i: any) => i.installationRequest)

  // ================= ACTION =================

  const updateStatus = async (status: string) => {
    await OrderService.updateStatus(id, status)
    await fetchOrder()
  }

  const createShipment = async () => {
    await OrderService.createShipment(id)
    await fetchOrder()
  }

  const updateShipmentStatus = async (status: string) => {
    await OrderService.updateShipment(order.shipmentId, status)
    await fetchOrder()
  }
  return (
    <div className="flex h-screen bg-orange-50">
      <VendorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <VendorHeader title="Chi tiết đơn hàng" />
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Back Button */}
            <div className="flex justify-between items-center">
            <Link href="/vendor/orders" className="flex items-center gap-2 text-orange-600">
              <ChevronLeft size={20} />
              Quay lại
            </Link>

            <div className="flex gap-3">

              {/* ===== KHÔNG LẮP ĐẶT ===== */}
              {!hasInstallation && (
                <>
                  {order.status === 'Chờ xác nhận' && (
                    <Button onClick={() => updateStatus('CONFIRMED')}>
                      Xác nhận đơn hàng
                    </Button>
                  )}

                  {order.status === 'Đã xác nhận' && (
                    <Button onClick={() => updateStatus('READY')}>
                      Đã đóng gói xong
                    </Button>
                  )}

                  {order.status === 'Đã đóng gói' && (
                    <Button
                      onClick={async () => {
                        await createShipment()
                        await updateStatus('SHIPPED')
                      }}
                    >
                      Bàn giao vận chuyển
                    </Button>
                  )}
                </>
              )}

              {/* ===== CÓ LẮP ĐẶT ===== */}
              {hasInstallation && (
                <>
                  {order.status === 'Chờ xác nhận' && (
                    <Button onClick={() => updateStatus('CONFIRMED')}>
                      Xác nhận đơn hàng
                    </Button>
                  )}

                  {order.status === 'Đã xác nhận' && (
                    <Button onClick={() => updateStatus('READY')}>
                      Đã đóng gói xong
                    </Button>
                  )}

                  {order.status === 'Đã đóng gói' && (
                    <Button
                      onClick={async () => {
                        await createShipment()
                        await updateStatus('SHIPPED')
                      }}
                    >
                      Tự vận chuyển
                    </Button>
                  )}

                  {/* ✅ SAU SHIPPED → DROPDOWN */}
                  {order.status === 'Đang vận chuyển' && order.shipmentStatus && (
                    <select
                      value={order.shipmentStatus}
                      onChange={(e) => updateShipmentStatus(e.target.value)}
                      className="h-14 border-2 border-orange-200 rounded-lg px-3"
                    >
                      {shipmentOptions.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  )}
                </>
              )}

            </div>
          </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Customer Info */}
                <Card className="border-2 border-orange-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Thông tin khách hàng</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Họ tên</p>
                      <p className="font-semibold text-gray-900">{order.customer?.name}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Số điện thoại</p>
                      <p className="font-semibold text-gray-900">{order.customer?.phone}</p>
                    </div>

                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Địa chỉ</p>
                      <p className="font-semibold text-gray-900">{order.customer?.address}</p>
                    </div>
                  </div>
                </Card>

                {/* Order Items */}
                <Card className="border-2 border-orange-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Sản phẩm đơn hàng</h3>
                  <div className="space-y-3">
                    {order.items?.map((item: any) => (

                      <div key={item.id} className="flex items-center gap-4 p-3 bg-orange-50 rounded-lg">

                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} className="w-full h-full object-cover rounded" />
                          ) : (
                            <span className="text-sm text-gray-500">IMG</span>
                          )}
                        </div>

                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">{item.variant}</p>
                          {item.installationRequest && (
                            <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-700 rounded">
                              Yêu cầu lắp đặt
                            </span>
                          )}
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{item.quantity}x</p>
                          <p className="text-sm text-orange-600 font-semibold">
                            {item.price.toLocaleString()}đ
                          </p>
                        </div>

                      </div>

                    ))}
                  </div>
                </Card>

                {/* Timeline */}
                <Card className="border-2 border-orange-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Thời gian xử lý</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thời gian đặt hàng:</span>
                      <span className="font-semibold">{order.orderTime}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Thời gian thanh toán:</span>
                      <span className="font-semibold">{order.paymentTime}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Thời gian nhận hàng:</span>
                      <span className="font-semibold">{order.deliveryTime}</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Payment */}
                <Card className="border-2 border-orange-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Phương thức thanh toán</h3>
                  <p className="text-center font-semibold text-gray-900">{order.paymentMethod}</p>
                </Card>

                {/* Summary */}
                <Card className="border-2 border-orange-200 p-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng tiền hàng</span>
                    <span className="font-semibold">{order.subtotal.toLocaleString()}đ</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="font-semibold">{order.shippingFee.toLocaleString()}đ</span>
                  </div>

                  <div className="border-t border-orange-200 pt-3 flex justify-between">
                    <span className="font-semibold text-gray-900">Tổng tiền</span>
                    <span className="font-bold text-lg text-orange-600">{order.total.toLocaleString()}đ</span>
                  </div>
                </Card>

                {/* Status */}
                <Card className="border-2 border-orange-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Trạng thái</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status}`}>
                    {order.status}
                  </span>

                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
