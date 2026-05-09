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
import { VendorType } from "@/utils/VendorType";
import { VendorService } from "@/hooks/vendor.service";
import {
  getOrderStatusConfig,
  getOrderDetailStatusConfig,
  getShipmentStatusConfig,
} from "@/utils/uiMapper";
import { formatVND } from "@/utils/number";
import { formatLocalDateTime } from "@/utils/day";
import { useEffect, useState } from "react";
import {
  Loader2,
  Banknote,
  Truck,
  Tag,
  FileText,
  XCircle,
  CheckCircle2,
  Clock,
  Store,
  MapPin,
  CreditCard,
  Package,
} from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderType;
  onPayout: (orderId: string, orderNumber: string) => void; // ← thêm orderNumber cho confirm
};

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between items-center px-4 py-2.5">
    <span className="text-gray-500 shrink-0 text-sm">{label}</span>
    <span className="text-gray-800 font-medium text-sm text-right">
      {value}
    </span>
  </div>
);

const DetailModal = ({ open, onOpenChange, order, onPayout }: Props) => {
  const [vendor, setVendor] = useState<VendorType | null>(null);
  const [isFetchingVendor, setIsFetchingVendor] = useState(false);

  const statusConfig = getOrderStatusConfig(order.status);
  const canPayout = order.status === "COMPLETED" && !order.paidOut;
  const primaryVendorId = order.shipments?.[0]?.vendorId ?? null;

  useEffect(() => {
    if (!open || !primaryVendorId) {
      setVendor(null);
      return;
    }
    setIsFetchingVendor(true);
    VendorService.getById(primaryVendorId)
      .then(setVendor)
      .catch(() => setVendor(null))
      .finally(() => setIsFetchingVendor(false));
  }, [open, primaryVendorId]);

  // ---- Tính luồng tiền từ orderDetails ----
  const productSubtotal = order.orderDetails.reduce(
    (sum, d) => sum + d.subtotal,
    0,
  );
  // subtotal của từng item đã là (unitPrice * quantity), discountAmount tách riêng
  const itemDiscountTotal = order.orderDetails.reduce(
    (sum, d) => sum + (d.discountAmount ?? 0),
    0,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-2xl rounded-2xl max-h-[90vh] overflow-hidden p-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-orange-700">
              Đơn hàng #{order.orderNumber}
            </DialogTitle>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.textColor}`}
            >
              {statusConfig.label}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            {formatLocalDateTime(order.createdAt)}
          </p>
        </DialogHeader>

        {/* Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] px-6 py-5 space-y-5 text-sm">
          {/* Thông tin nhà cung cấp */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Store size={15} className="text-orange-500" />
              Thông tin nhà cung cấp
            </h4>
            <div className="border rounded-xl divide-y divide-gray-100">
              {isFetchingVendor ? (
                <div className="flex items-center justify-center py-6 gap-2 text-gray-400">
                  <Loader2 size={16} className="animate-spin" />
                  <span>Đang tải...</span>
                </div>
              ) : vendor ? (
                <>
                  <Row label="Tên nhà cung cấp" value={vendor.businessName} />
                  {vendor.phoneNumber && (
                    <Row label="Số điện thoại" value={vendor.phoneNumber} />
                  )}
                  {vendor.address && (
                    <Row label="Địa chỉ" value={vendor.address} />
                  )}
                  <Row
                    label="Đã thanh toán cho NCC"
                    value={
                      order.paidOut ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle2 size={14} /> Đã trả
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600">
                          <XCircle size={14} /> Chưa trả
                        </span>
                      )
                    }
                  />
                </>
              ) : (
                <div className="px-4 py-3 text-gray-400">
                  {primaryVendorId
                    ? "Không thể tải thông tin nhà cung cấp"
                    : "Không có thông tin nhà cung cấp"}
                </div>
              )}
            </div>
          </div>

          {/* Thông tin giao hàng */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <MapPin size={15} className="text-orange-500" />
              Thông tin giao hàng
            </h4>
            <div className="border rounded-xl divide-y divide-gray-100">
              <Row label="Người nhận" value={order.recipientName} />
              <Row label="Số điện thoại" value={order.recipientPhone} />
              <Row label="Địa chỉ" value={order.shippingAddress} />
            </div>
          </div>

          {/* Thanh toán */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <CreditCard size={15} className="text-orange-500" />
              Thanh toán
            </h4>
            <div className="border rounded-xl divide-y divide-gray-100">
              <Row label="Phương thức" value={order.paymentMethod} />
              <Row
                label="Trạng thái"
                value={
                  order.paid ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 size={14} /> Đã thanh toán
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-yellow-600">
                      <Clock size={14} /> Chưa thanh toán
                    </span>
                  )
                }
              />
              {order.paidAt && (
                <Row
                  label="Ngày thanh toán"
                  value={formatLocalDateTime(order.paidAt)}
                />
              )}
            </div>
          </div>

          {/* ---- Danh sách sản phẩm từ orderDetails ---- */}
          {order.orderDetails.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Package size={15} className="text-orange-500" />
                Sản phẩm ({order.orderDetails.length})
              </h4>
              <div className="border rounded-xl overflow-hidden divide-y divide-gray-100">
                {order.orderDetails.map((detail) => {
                  const dCfg = getOrderDetailStatusConfig(detail.status);
                  return (
                    <div
                      key={detail.orderDetailId}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <img
                        src={detail.productImageUrl}
                        alt={detail.productName}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">
                          {detail.productName}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatVND(detail.unitPrice)} × {detail.quantity}
                        </p>
                        {detail.discountAmount > 0 && (
                          <p className="text-xs text-red-400 mt-0.5">
                            Giảm: -{formatVND(detail.discountAmount)}
                          </p>
                        )}
                        {detail.installationRequest && (
                          <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                            Yêu cầu lắp đặt
                          </span>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0 space-y-1">
                        <p className="font-bold text-orange-600">
                          {formatVND(detail.subtotal)}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${dCfg.bgColor} ${dCfg.textColor}`}
                        >
                          {dCfg.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ---- Luồng tiền chi tiết ---- */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Tag size={15} className="text-orange-500" />
              Chi tiết tiền
            </h4>
            <div className="border rounded-xl overflow-hidden divide-y divide-gray-100">
              {/* Tổng tiền sản phẩm (trước giảm giá item) */}
              <Row
                label="Tổng tiền sản phẩm"
                value={formatVND(productSubtotal)}
              />
              {/* Giảm giá trên từng sản phẩm */}
              {itemDiscountTotal > 0 && (
                <Row
                  label="Giảm giá sản phẩm"
                  value={
                    <span className="text-red-500">
                      -{formatVND(itemDiscountTotal)}
                    </span>
                  }
                />
              )}
              {/* Phí giao hàng */}
              <Row
                label="Phí giao hàng"
                value={
                  <span className="flex items-center gap-1">
                    <Truck size={13} className="text-gray-400" />
                    {formatVND(order.shippingFee)}
                  </span>
                }
              />
              {/* Giảm giá đơn hàng (order-level) */}
              {order.discountAmount > 0 && (
                <Row
                  label="Giảm giá đơn hàng"
                  value={
                    <span className="text-red-500">
                      -{formatVND(order.discountAmount)}
                    </span>
                  }
                />
              )}
              {/* Tổng thanh toán */}
              <div className="flex justify-between items-center px-4 py-3 bg-orange-50">
                <span className="font-semibold text-gray-800">
                  Tổng thanh toán
                </span>
                <span className="text-lg font-bold text-orange-600">
                  {formatVND(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Lô hàng — chỉ hiển thị thông tin vận chuyển, không lặp lại sản phẩm */}
          {order.shipments.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Truck size={15} className="text-orange-500" />
                Thông tin vận chuyển
              </h4>
              <div className="space-y-2">
                {order.shipments.map((shipment) => {
                  const shipCfg = getShipmentStatusConfig(shipment.status);
                  return (
                    <div
                      key={shipment.shipmentId}
                      className="border rounded-xl divide-y divide-gray-100"
                    >
                      <div className="flex justify-between items-center px-4 py-2.5">
                        <span className="font-medium text-gray-700 text-sm">
                          {shipment.vendorName}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${shipCfg.bgColor} ${shipCfg.textColor}`}
                        >
                          {shipCfg.label}
                        </span>
                      </div>
                      {shipment.shippingProvider && (
                        <Row
                          label="Đơn vị vận chuyển"
                          value={shipment.shippingProvider}
                        />
                      )}
                      {shipment.trackingNumber && (
                        <Row
                          label="Mã vận đơn"
                          value={
                            <span className="font-mono">
                              {shipment.trackingNumber}
                            </span>
                          }
                        />
                      )}
                      {shipment.estimatedDeliveryAt && (
                        <Row
                          label="Dự kiến giao"
                          value={formatLocalDateTime(
                            shipment.estimatedDeliveryAt,
                          )}
                        />
                      )}
                      {shipment.deliveredAt && (
                        <Row
                          label="Đã giao lúc"
                          value={formatLocalDateTime(shipment.deliveredAt)}
                        />
                      )}
                      {shipment.cancellationReason && (
                        <Row
                          label="Lý do huỷ"
                          value={shipment.cancellationReason}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ghi chú */}
          {order.notes && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FileText size={15} className="text-orange-500" />
                Ghi chú
              </h4>
              <div className="border rounded-xl p-4 bg-blue-50 border-blue-100 text-gray-700">
                {order.notes}
              </div>
            </div>
          )}

          {/* Thông tin huỷ */}
          {order.cancelledAt && (
            <div>
              <h4 className="font-semibold text-red-600 mb-2 flex items-center gap-2">
                <XCircle size={15} className="text-red-500" />
                Thông tin huỷ đơn
              </h4>
              <div className="border border-red-100 rounded-xl divide-y divide-red-50">
                <Row
                  label="Ngày huỷ"
                  value={formatLocalDateTime(order.cancelledAt)}
                />
                {order.cancellationReason && (
                  <Row label="Lý do" value={order.cancellationReason} />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t bg-gray-50 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          {canPayout && (
            <Button
              onClick={() => onPayout(order.orderId, order.orderNumber)}
              className="bg-orange-50 text-orange-700 hover:bg-orange-200 hover:text-orange-700"
            >
              Trả tiền nhà cung cấp
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;
