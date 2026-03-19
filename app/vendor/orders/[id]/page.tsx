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
      imageUrl: ""
    },
    {
      id: "2",
      name: "Dây kháng lực",
      variant: "Medium",
      quantity: 2,
      price: 150000,
      imageUrl: ""
    }
  ]
}

export default function OrderDetails() {

  const params = useParams()
  const id = params?.id as string

  const [order, setOrder] = useState<any>(mockOrder)

  const router = useRouter()

  const handleReload = () => {
    router.refresh()
  }

  const mapStatus = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ xác nhận'
      case 'CONFIRMED':
        return 'Đã xác nhận'
      case 'COMPLETED':
        return 'Hoàn thành'
      case 'PROCESSING':
        return 'Đang chuẩn bị hàng'
      case 'DELIVERING':
        return 'Đang giao'
      case 'DELIVERED':
        return 'Đã giao'
      case 'CANCELLED':
        return 'Bị hủy'
      case 'REFUNDED':
        return 'Hoàn trả'
      default:
        return status
    }
  }

  const statusOptions = [
    'CONFIRMED',
    'PROCESSING',
    'DELIVERING',
    'DELIVERED',
    'COMPLETED',
    'CANCELLED',
    'REFUNDED'
  ]

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Chờ xác nhận':
        return 'bg-yellow-100 text-yellow-700'

      case 'Đã xác nhận':
      case 'Đang chuẩn bị hàng':
        return 'bg-blue-100 text-blue-700'

      case 'Đang giao':
        return 'bg-purple-100 text-purple-700'

      case 'Đã giao':
      case 'Hoàn thành':
        return 'bg-green-100 text-green-700'

      case 'Bị hủy':
      case 'Hoàn trả':
        return 'bg-red-100 text-red-700'

      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getDisplayStatus = (orderStatus: string, shipmentStatus?: string) => {

    // TH1
    if (
      ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(orderStatus)
    ) {
      return orderStatus
    }

    // TH2
    if (orderStatus === 'PROCESSING' && shipmentStatus === 'PENDING') {
      return 'PROCESSING'
    }

    // TH3
    if (orderStatus === 'PROCESSING') {
      return shipmentStatus || 'PROCESSING'
    }

    return orderStatus
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('vi-VN')
  }


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
          variant: '', // API chưa có → để trống hoặc custom
          quantity: item.quantity,
          price: item.unitPrice,
          imageUrl: item.productImageUrl,
          installationRequest: item.installationRequest,
        })),
      }

      setOrder(mapped)

    } else {
      setOrder(mockOrder)
    }

  }

  useEffect(() => {

    if (!id) return

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
            variant: '', // API chưa có → để trống hoặc custom
            quantity: item.quantity,
            price: item.unitPrice,
            imageUrl: item.productImageUrl,
            installationRequest: item.installationRequest,
          })),
        }

        setOrder(mapped)

      } else {
        setOrder(mockOrder)
      }

    }

    fetchOrder()

  }, [id])

  const handleApproveOrder = async () => {
    await OrderService.approveOrder(id)
    await fetchOrder()
  }

  const handleCancelOrder = async () => {
    await fetchOrder()
  }

  const updateStatus = async (status: string) => {
    await OrderService.updateStatus(id, status);
    await fetchOrder()
  }
  const createShipment = async () => {
    await OrderService.createShipment(id);
    await fetchOrder()
  }

  const getRawStatus = (statusText: string) => {
    switch (statusText) {
      case 'Chờ xác nhận':
        return 'PENDING'
      case 'Đã xác nhận':
        return 'CONFIRMED'
      case 'Đang chuẩn bị hàng':
        return 'PROCESSING'
      case 'Đang giao':
        return 'DELIVERING'
      case 'Đã giao':
        return 'DELIVERED'
      case 'Hoàn thành':
        return 'COMPLETED'
      case 'Bị hủy':
        return 'CANCELLED'
      case 'Hoàn trả':
        return 'REFUNDED'
      default:
        return statusText
    }
  }

  const hasInstallation = order.items?.some((item: any) => item.installationRequest)
  console.log("status:", order);
  return (
    <div className="flex h-screen bg-orange-50">
      <VendorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <VendorHeader title="Chi tiết đơn hàng" />
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Back Button */}
            <div className="flex items-center justify-between">
              <Link href="/vendor/orders" className="flex items-center gap-2 text-orange-600 hover:text-orange-700">
                <ChevronLeft size={20} />
                Quay lại
              </Link>


              <div className="flex gap-3 items-stretch">

                {/* TH1 & TH2: PENDING */}
                {getRawStatus(order.status) === 'PENDING' && (
                  <>
                    <Button
                      onClick={() => handleCancelOrder()}
                      className="bg-red-500 hover:bg-red-600 text-white flex-1 flex items-center justify-center h-14">
                      Hủy đơn
                    </Button>

                    <Button
                      onClick={() => handleApproveOrder()}
                      className="bg-green-500 hover:bg-green-600 text-white flex-1 flex flex-col justify-center items-center h-14">
                      <span>Xác nhận</span>
                      {hasInstallation && (
                        <span className="text-[10px] text-green-100 leading-tight">
                          (Tự giao & lắp đặt)
                        </span>
                      )}
                    </Button>
                  </>
                )}

                {/* TH1: installationRequest = false */}
                {!hasInstallation && getRawStatus(order.status) === 'CONFIRMED' && (
                  <Button
                    onClick={() => {
                      updateStatus('PROCESSING');
                      createShipment();
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white flex-1 h-14">
                    Đã gói hàng xong
                  </Button>
                )}

                {/* TH2: installationRequest = true && != PENDING */}
                {hasInstallation && getRawStatus(order.status) !== 'PENDING' && (
                  <select
                    onChange={(e) => updateStatus(e.target.value)}
                    className="flex-1 h-14 border-2 border-orange-200 rounded-lg px-3 font-semibold text-gray-700"
                    defaultValue={getRawStatus(order.status)}
                  >
                    {statusOptions.map((st) => (
                      <option key={st} value={st}>
                        {mapStatus(st)}
                      </option>
                    ))}
                  </select>
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
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(order.status)}`}>
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
