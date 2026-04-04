import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OrderType } from "@/utils/OrderType";
import {
  getOrderStatusConfig,
  getOrderDetailStatusConfig,
} from "@/utils/uiMapper";
import { formatVND } from "@/utils/number";
import { formatLocalDateTime } from "@/utils/day";
import {
  User,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  Calendar,
  Tag,
  FileText,
  Package,
  Wallet,
  XCircle,
} from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderType;
  onPayout: (orderId: string) => void;
};

const DetailModal = ({ open, onOpenChange, order, onPayout }: Props) => {
  const statusConfig = getOrderStatusConfig(order.status);
  const canPayout = order.status === "COMPLETED" && !order.paidOut;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-2xl p-0 rounded-2xl max-h-[90vh] overflow-hidden border-0 shadow-2xl">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-r from-orange-500 to-orange-600">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-white">
                Đơn hàng #{order.orderNumber}
              </DialogTitle>
              <p className="text-orange-100 text-sm mt-1">
                {formatLocalDateTime(order.createdAt)}
              </p>
            </div>
            <span
              className={`px-4 py-1.5 mr-2 rounded-full text-sm font-semibold shadow-sm ${statusConfig.bgColor} ${statusConfig.textColor}`}
            >
              {statusConfig.label}
            </span>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] px-6 py-5 space-y-5">
          {/* Thông tin khách hàng */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-orange-500" />
              Thông tin người nhận
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm">
                <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-orange-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Họ tên</p>
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {order.recipientName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Số điện thoại</p>
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {order.recipientPhone}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm sm:col-span-2">
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">Địa chỉ giao hàng</p>
                  <p className="text-sm font-medium text-gray-800">
                    {order.shippingAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin thanh toán */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-orange-500" />
              Thông tin thanh toán
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                <CreditCard className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Phương thức</p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">
                  {order.paymentMethod}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                <Wallet className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Thanh toán</p>
                <span
                  className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.paid
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.paid ? "Đã TT" : "Chưa TT"}
                </span>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                <Package className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Trả vendor</p>
                <span
                  className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.paidOut
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.paidOut ? "Đã trả" : "Chưa trả"}
                </span>
              </div>
              {order.paidAt && (
                <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                  <Calendar className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Ngày TT</p>
                  <p className="text-xs font-medium text-gray-800 mt-0.5">
                    {formatLocalDateTime(order.paidAt)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Chi phí */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
            <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-orange-500" />
              Chi tiết thanh toán
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gray-400" />
                  Phí giao hàng
                </span>
                <span className="font-medium text-gray-800">
                  {formatVND(order.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-400" />
                  Giảm giá
                </span>
                <span className="font-medium text-red-500">
                  -{formatVND(order.discountAmount)}
                </span>
              </div>
              <div className="border-t border-orange-200 pt-3 mt-3 flex justify-between items-center">
                <span className="text-base font-semibold text-gray-800">
                  Tổng cộng
                </span>
                <span className="text-xl font-bold text-orange-600">
                  {formatVND(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Ghi chú */}
          {order.notes && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                Ghi chú
              </h4>
              <p className="text-sm text-gray-700">{order.notes}</p>
            </div>
          )}

          {/* Thông tin huỷ đơn */}
          {order.cancelledAt && (
            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
              <h4 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                Thông tin huỷ đơn
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày huỷ</span>
                  <span className="font-medium text-gray-800">
                    {formatLocalDateTime(order.cancelledAt)}
                  </span>
                </div>
                {order.cancellationReason && (
                  <div>
                    <span className="text-gray-600">Lý do: </span>
                    <span className="text-gray-800">
                      {order.cancellationReason}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Chi tiết sản phẩm */}
          {order.orderDetails.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Package className="w-4 h-4 text-orange-500" />
                Sản phẩm ({order.orderDetails.length})
              </h4>
              <div className="space-y-2">
                {order.orderDetails.map((detail) => {
                  const detailConfig = getOrderDetailStatusConfig(
                    detail.status,
                  );
                  return (
                    <div
                      key={detail.orderDetailId}
                      className="flex items-center gap-4 p-3 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <img
                        src={detail.productImageUrl}
                        alt={detail.productName}
                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-gray-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {detail.productName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatVND(detail.unitPrice)} × {detail.quantity}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-base font-bold text-orange-600">
                          {formatVND(detail.subtotal)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100 gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 sm:flex-none"
          >
            Đóng
          </Button>
          {canPayout && (
            <Button
              onClick={() => {
                onPayout(order.orderId);
                onOpenChange(false);
              }}
              className="flex-1 sm:flex-none bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-200"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Trả tiền vendor
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;
