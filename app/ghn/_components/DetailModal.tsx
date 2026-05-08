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
import {
  Truck,
  Package,
  MapPin,
  Phone,
  User,
  CreditCard,
  Wallet,
} from "lucide-react";
import {
  getOrderDetailStatusConfig,
  getOrderStatusConfig,
  getShipmentStatusConfig,
} from "@/utils/uiMapper";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: OrderType;
  onMarkDelivered: (item: OrderType) => void;
};

const formatDate = (date: string | null) =>
  date ? new Date(date).toLocaleString("vi-VN") : "—";

const formatMoney = (amount: number) => amount.toLocaleString("vi-VN") + "đ";

const DetailModal = ({ open, onOpenChange, item, onMarkDelivered }: Props) => {
  const orderStatusCfg = getOrderStatusConfig(item.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-2xl rounded-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-orange-700">
              Chi tiết đơn hàng #{item.orderNumber}
            </DialogTitle>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${orderStatusCfg.bgColor} ${orderStatusCfg.textColor}`}
            >
              {orderStatusCfg.label}
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-5">
          {/* ── THÔNG TIN NGƯỜI NHẬN ── */}
          <section className="bg-orange-50 rounded-xl p-4 space-y-2">
            <h3 className="text-sm font-semibold text-orange-700 uppercase tracking-wide mb-3">
              Thông tin người nhận
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <User size={15} className="text-orange-400 shrink-0" />
              <span className="font-medium">{item.recipientName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Phone size={15} className="text-orange-400 shrink-0" />
              <span>{item.recipientPhone}</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <MapPin size={15} className="text-orange-400 shrink-0 mt-0.5" />
              <span>{item.shippingAddress}</span>
            </div>
            {item.notes && (
              <div className="flex items-start gap-2 text-sm text-gray-500">
                <span className="text-orange-400">📝</span>
                <span className="italic">{item.notes}</span>
              </div>
            )}
          </section>

          {/* ── THÔNG TIN THANH TOÁN ── */}
          <section className="bg-white border border-orange-100 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-orange-700 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Wallet size={15} />
              Thanh toán
            </h3>
            <div className="space-y-2">
              <Row
                label="Phương thức"
                value={
                  <span className="flex items-center gap-1">
                    <CreditCard size={14} className="text-gray-400" />
                    {item.paymentMethod}
                  </span>
                }
              />
              <Row
                label="Tổng tiền hàng"
                value={
                  <span className="font-semibold">
                    {formatMoney(
                      item.totalAmount + item.discountAmount - item.shippingFee,
                    )}
                  </span>
                }
              />
              <Row
                label="Phí vận chuyển"
                value={formatMoney(item.shippingFee)}
              />
              <Row
                label="Giảm giá"
                value={
                  <span className="text-green-600">
                    -{formatMoney(item.discountAmount)}
                  </span>
                }
              />
              <div className="border-t border-orange-100 pt-2 flex justify-between items-center">
                <span className="font-semibold text-gray-800">Thành tiền</span>
                <span className="text-lg font-bold text-orange-600">
                  {formatMoney(item.totalAmount)}
                </span>
              </div>
              <Row
                label="Trạng thái thanh toán"
                value={
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.paid
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.paid ? "Đã thanh toán" : "Chưa thanh toán"}
                  </span>
                }
              />
              {item.paidAt && (
                <Row
                  label="Thời gian thanh toán"
                  value={formatDate(item.paidAt)}
                />
              )}
            </div>
          </section>

          {/* ── SẢN PHẨM ── */}
          <section className="bg-white border border-orange-100 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-orange-700 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Package size={15} />
              Sản phẩm ({item.orderDetails.length})
            </h3>
            <div className="space-y-3">
              {item.orderDetails.map((d) => {
                const cfg = getOrderDetailStatusConfig(d.status);
                return (
                  <div
                    key={d.orderDetailId}
                    className="flex items-center gap-3 py-2 border-b border-orange-50 last:border-0"
                  >
                    {d.productImageUrl && (
                      <img
                        src={d.productImageUrl}
                        alt={d.productName}
                        className="w-12 h-12 rounded-lg object-cover border border-orange-100 shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {d.productName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatMoney(d.unitPrice)} × {d.quantity}
                      </p>
                      {d.discountAmount > 0 && (
                        <p className="text-xs text-green-600">
                          Giảm: -{formatMoney(d.discountAmount)}
                        </p>
                      )}
                      {d.installationRequest && (
                        <p className="text-xs text-blue-600">
                          🔧 Yêu cầu lắp đặt
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-orange-600">
                        {formatMoney(d.subtotal)}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.bgColor} ${cfg.textColor}`}
                      >
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── SHIPMENTS ── */}
          {item.shipments.length > 0 && (
            <section className="bg-white border border-orange-100 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-orange-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Truck size={15} />
                Vận chuyển
              </h3>
              <div className="space-y-4">
                {item.shipments.map((s) => {
                  const cfg = getShipmentStatusConfig(s.status);
                  return (
                    <div
                      key={s.shipmentId}
                      className="bg-orange-50 rounded-lg p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          {s.vendorName}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.bgColor} ${cfg.textColor}`}
                        >
                          {cfg.label}
                        </span>
                      </div>
                      {s.shippingProvider && (
                        <Row
                          label="Đơn vị vận chuyển"
                          value={s.shippingProvider}
                        />
                      )}
                      {s.trackingNumber && (
                        <Row
                          label="Mã tracking"
                          value={
                            <span className="font-mono text-xs bg-white px-2 py-0.5 rounded border">
                              {s.trackingNumber}
                            </span>
                          }
                        />
                      )}
                      {s.estimatedDeliveryAt && (
                        <Row
                          label="Dự kiến giao"
                          value={formatDate(s.estimatedDeliveryAt)}
                        />
                      )}
                      {s.shippedAt && (
                        <Row label="Ngày gửi" value={formatDate(s.shippedAt)} />
                      )}
                      {s.deliveredAt && (
                        <Row
                          label="Ngày giao"
                          value={formatDate(s.deliveredAt)}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── THỜI GIAN ── */}
          <section className="border-t pt-3 space-y-1 text-sm text-gray-500">
            <Row label="Ngày đặt hàng" value={formatDate(item.createdAt)} />
            <Row label="Cập nhật lần cuối" value={formatDate(item.updatedAt)} />
            {item.cancelledAt && (
              <Row label="Ngày hủy" value={formatDate(item.cancelledAt)} />
            )}
            {item.cancellationReason && (
              <Row label="Lý do hủy" value={item.cancellationReason} />
            )}
          </section>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          <Button
            onClick={() => onMarkDelivered(item)}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            Xác nhận đã giao
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Helper row component
const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between items-center gap-4 text-sm">
    <span className="text-gray-500 shrink-0">{label}</span>
    <span className="text-gray-800 text-right">{value}</span>
  </div>
);

export default DetailModal;
