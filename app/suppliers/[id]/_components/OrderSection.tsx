import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { OrderType } from "@/utils/OrderType";
import { getOrderStatusConfig } from "@/utils/uiMapper";
import { formatShortVND } from "@/utils/number";
import { formatLocalDateTime } from "@/utils/day";

type Props = {
  orders: OrderType[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const OrderSection = ({
  orders,
  currentPage,
  totalPages,
  onPageChange,
}: Props) => {
  return (
    <div className="bg-white rounded-2xl border-2 border-orange-200 p-5">
      <h3 className="text-base font-semibold text-orange-700 mb-4">
        Đơn hàng gần đây
      </h3>

      <div className="flex-1 space-y-2" style={{ maxHeight: 340 }}>
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <Package size={32} className="mb-2 opacity-30" />
            <p className="text-sm">Không có đơn hàng</p>
          </div>
        ) : (
          orders.map((order) => {
            const statusConfig = getOrderStatusConfig(order.status);
            return (
              <div
                key={order.orderId}
                className="p-3 rounded-xl border border-orange-100 hover:bg-orange-50 transition-colors space-y-2.5"
              >
                {/* Row 1: order number + status */}
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-700 truncate">
                    #{order.orderNumber}
                  </p>
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}
                  >
                    {statusConfig.label}
                  </span>
                </div>

                {/* Row 2: recipient */}
                <div className="text-xs text-gray-500 line-clamp-1">
                  {order.recipientName} · {order.recipientPhone} ·{" "}
                  <span className="text-gray-400">{order.shippingAddress}</span>
                </div>

                {/* Row 4: amount + payment + date */}
                <div className="flex items-center justify-between pt-1 border-t border-orange-50">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-orange-600">
                      {formatShortVND(order.totalAmount)}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                        order.paid
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {order.paid ? "Đã TT" : "Chưa TT"}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatLocalDateTime(order.createdAt, "date")}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="p-1 hover:bg-orange-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} className="text-orange-600" />
          </button>
          <span className="text-gray-600 text-sm">
            {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage + 1 >= totalPages}
            className="p-1 hover:bg-orange-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} className="text-orange-600" />
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderSection;
