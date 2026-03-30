"use client";

import { useState, useEffect } from "react";
import { VendorSidebar } from "@/components/vendor-sidebar";
import { VendorHeader } from "@/components/vendor-header";
import { Card } from "@/components/ui/card";
import { Search, Eye } from "lucide-react";
import Link from "next/link";
import { OrderService } from "@/hooks/order.service";
import { Sidebar } from "@/components/sidebar";

const ORDER_STATUS = [
  "PENDING",
  "CONFIRMED",
  "READY",
  "SHIPPED",
  "DELIVERED",
  "FAILED_DELIVERY",
  "COMPLETED",
  "CANCELLED",
  "RETURNED",
  "REFUNDED",
];

const SHIPMENT_STATUS = [
  "DRAFT",
  "READY_TO_PICK",
  "PICKING",
  "PICKED",
  "STORING",
  "TRANSPORTING",
  "DELIVERING",
  "DELIVERED",
  "DELIVERY_FAIL",
  "RETURN",
  "RETURNING",
  "RETURNED",
  "CANCELLED",
];

export default function VendorOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  // map status sang tiếng Việt
  const mapStatus = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "READY":
        return "Sẵn sàng";
      case "SHIPPED":
        return "Đang giao";
      case "DELIVERED":
        return "Đã giao";
      case "FAILED_DELIVERY":
        return "Giao thất bại";
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Bị hủy";
      case "RETURNED":
        return "Trả hàng";
      case "REFUNDED":
        return "Hoàn tiền";
      default:
        return status;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("vi-VN");
  };

  // fetch data
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await OrderService.getAllOrders();

        if (res.success) {
          setOrders(res.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // update order status
  const handleOrderStatus = async (orderId: string, status: string) => {
    setUpdating(orderId);

    try {
      await OrderService.updateStatus(orderId, status);

      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId ? { ...o, status } : o
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  // update shipment status
  const handleShipmentStatus = async (
    orderId: string,
    shipmentId: string,
    status: string
  ) => {
    setUpdating(shipmentId);

    try {
      await OrderService.updateShipment(shipmentId, status);

      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId
            ? {
                ...o,
                shipments: o.shipments.map((s: any) =>
                  s.shipmentId === shipmentId
                    ? { ...s, status }
                    : s
                ),
              }
            : o
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  // create shipment
  const handleCreateShipment = async (orderId: string) => {
    setUpdating(orderId);

    try {
      const res = await OrderService.createShipment(orderId);

      if (res.success) {
        const newShipment = res.data;

        setOrders((prev) =>
          prev.map((o) =>
            o.orderId === orderId
              ? {
                  ...o,
                  shipments: [...(o.shipments || []), newShipment],
                }
              : o
          )
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  // debounce search
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredOrders = orders.filter((order) => {
    const keyword = debouncedSearch.toLowerCase();

    return (
      order.recipientName?.toLowerCase().includes(keyword) ||
      order.orderNumber?.toLowerCase().includes(keyword) ||
      order.recipientPhone?.toLowerCase().includes(keyword)
    );
  });

  if (loading) {
    return (
      <div className="flex min-h-screen bg-orange-50">
        <Sidebar />
        <div className="flex items-center justify-center w-full">
          <p className="text-lg text-orange-700">Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-orange-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <VendorHeader title="Giả lập GHN" />

        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">

            {/* Search */}
            <div className="flex items-center gap-2 bg-white rounded-lg border border-orange-200 px-4">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Tìm đơn..."
                className="flex-1 py-2 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Table */}
            <Card className="border-2 border-orange-200 p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-orange-200">
                      <th className="p-3">Mã đơn</th>
                      <th className="p-3">Khách hàng</th>
                      <th className="p-3">SĐT</th>
                      <th className="p-3">Thanh toán</th>
                      <th className="p-3">Tiền</th>
                      <th className="p-3">Ngày</th>
                      <th className="p-3">Trạng thái</th>
                      <th className="p-3">Chi tiết</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr
                        key={order.orderId}
                        className="border-b hover:bg-orange-50"
                      >
                        <td className="p-3 font-medium">
                          {order.orderNumber}
                        </td>
                        <td className="p-3">{order.recipientName}</td>
                        <td className="p-3">{order.recipientPhone}</td>
                        <td className="p-3">{order.paymentMethod}</td>
                        <td className="p-3 text-orange-600 font-semibold">
                          {order.totalAmount.toLocaleString()}đ
                        </td>
                        <td className="p-3">
                          {formatDate(order.createdAt)}
                        </td>

                        {/* 🔥 STATUS */}
                        <td className="p-3 space-y-2">

                          {/* ORDER */}
                          <div>
                            <p className="text-xs text-gray-400">Order</p>
                            <select
                              value={order.status}
                              disabled={updating === order.orderId}
                              onChange={(e) =>
                                handleOrderStatus(
                                  order.orderId,
                                  e.target.value
                                )
                              }
                              className="border rounded px-2 py-1 text-xs w-full"
                            >
                              {ORDER_STATUS.map((s) => (
                                <option key={s} value={s}>
                                  {mapStatus(s)}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* SHIPMENT */}
                          <div>
                            <p className="text-xs text-gray-400">
                              Shipment
                            </p>

                            {order.shipments?.length > 0 ? (
                              order.shipments.map((s: any) => (
                                <select
                                  key={s.shipmentId}
                                  value={s.status}
                                  disabled={updating === s.shipmentId}
                                  onChange={(e) =>
                                    handleShipmentStatus(
                                      order.orderId,
                                      s.shipmentId,
                                      e.target.value
                                    )
                                  }
                                  className="border rounded px-2 py-1 text-xs w-full mb-1"
                                >
                                  {SHIPMENT_STATUS.map((st) => (
                                    <option key={st} value={st}>
                                      {st}
                                    </option>
                                  ))}
                                </select>
                              ))
                            ) : (
                              <button
                                disabled={
                                  order.status !== "CONFIRMED" ||
                                  updating === order.orderId
                                }
                                onClick={() =>
                                  handleCreateShipment(order.orderId)
                                }
                                className="text-xs bg-blue-500 text-white px-2 py-1 rounded disabled:opacity-50"
                              >
                                Tạo shipment
                              </button>
                            )}
                          </div>
                        </td>

                        <td className="p-3">
                          <Link
                            href={`/vendor/orders/${order.orderId}`}
                            className="text-blue-600"
                          >
                            <Eye size={16} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredOrders.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    Không có đơn hàng
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}