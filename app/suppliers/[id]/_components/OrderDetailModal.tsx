"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OrderType } from "@/utils/OrderType";
import { getOrderStatusConfig } from "@/utils/uiMapper";
import { formatLocalDateTime } from "@/utils/day";
import { formatShortVND } from "@/utils/number";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderType | null;
};

const OrderDetailModal = ({ open, onOpenChange, order }: Props) => {
  if (!order) return null;

  const statusConfig = getOrderStatusConfig(order.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-xl rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-orange-700">
            Chi tiết đơn hàng
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Order header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Mã đơn hàng</p>
              <p className="font-bold text-gray-800">#{order.orderNumber}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}
            >
              {statusConfig.label}
            </span>
          </div>

          {/* Recipient info */}
          <div className="border rounded-xl p-3 space-y-2 text-sm bg-orange-50/40">
            <p className="font-medium text-orange-700 text-xs uppercase tracking-wide">
              Thông tin người nhận
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-gray-400 text-xs">Họ tên</p>
                <p className="text-gray-700 font-medium">
                  {order.recipientName}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Số điện thoại</p>
                <p className="text-gray-700 font-medium">
                  {order.recipientPhone}
                </p>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Địa chỉ</p>
              <p className="text-gray-700">{order.shippingAddress}</p>
            </div>
            {order.notes && (
              <div>
                <p className="text-gray-400 text-xs">Ghi chú</p>
                <p className="text-gray-700 italic">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Payment info */}
          <div className="border-t pt-3 space-y-2 text-sm">
            <p className="font-medium text-orange-700 text-xs uppercase tracking-wide">
              Thanh toán
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-gray-400 text-xs">Phương thức</p>
                <p className="text-gray-700 font-medium">
                  {order.paymentMethod}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Trạng thái</p>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    order.paid
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {order.paid ? "Đã thanh toán" : "Chưa thanh toán"}
                </span>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Phí vận chuyển</p>
                <p className="text-gray-700">
                  {formatShortVND(order.shippingFee)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Giảm giá</p>
                <p className="text-gray-700">
                  {order.discountAmount > 0
                    ? `-${formatShortVND(order.discountAmount)}`
                    : "—"}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center pt-1 border-t">
              <span className="font-semibold text-gray-700">Tổng cộng</span>
              <span className="text-lg font-bold text-orange-600">
                {formatShortVND(order.totalAmount)}
              </span>
            </div>
          </div>

          {/* Order details (products) */}
          {order.orderDetails.length > 0 && (
            <div className="border-t pt-3 space-y-2 text-sm">
              <p className="font-medium text-orange-700 text-xs uppercase tracking-wide">
                Sản phẩm ({order.orderDetails.length})
              </p>
              <div className="space-y-2">
                {order.orderDetails.map((detail) => (
                  <div
                    key={detail.orderDetailId}
                    className="flex items-center gap-3 p-2 rounded-lg border border-orange-100"
                  >
                    <img
                      src={detail.productImageUrl}
                      alt={detail.productName}
                      className="w-10 h-10 rounded object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-700 text-sm font-medium line-clamp-1">
                        {detail.productName}
                      </p>
                      <p className="text-gray-400 text-xs">
                        x{detail.quantity} · {formatShortVND(detail.unitPrice)}
                        /cái
                      </p>
                    </div>
                    <p className="text-orange-600 font-semibold text-sm">
                      {formatShortVND(detail.subtotal)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="border-t pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Ngày tạo</span>
              <span>{formatLocalDateTime(order.createdAt)}</span>
            </div>
            {order.paidAt && (
              <div className="flex justify-between">
                <span className="text-gray-500">Ngày thanh toán</span>
                <span>{formatLocalDateTime(order.paidAt)}</span>
              </div>
            )}
            {order.cancelledAt && (
              <div className="flex justify-between">
                <span className="text-gray-500">Ngày huỷ</span>
                <span className="text-red-500">
                  {formatLocalDateTime(order.cancelledAt)}
                </span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
