import { ChevronLeft, ChevronRight } from "lucide-react";
import { OrderType } from "@/utils/OrderType";
import { getOrderStatusConfig } from "@/utils/uiMapper";
import { formatShortVND } from "@/utils/number";

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
    <div className="bg-white rounded-2xl border-2 border-orange-200 py-4 px-6">
      <h3 className="text-lg font-semibold text-orange-700 mb-4">
        Đơn hàng gần đây
      </h3>

      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-orange-100">
            <th className="text-left py-3 px-4 font-semibold text-orange-700">
              Mã
            </th>
            <th className="text-left py-3 px-4 font-semibold text-orange-700">
              Tổng tiền
            </th>
            <th className="text-left py-3 px-4 font-semibold text-orange-700">
              Trạng thái
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="py-6 text-center text-gray-400 text-sm"
              >
                Không có đơn hàng
              </td>
            </tr>
          ) : (
            orders.map((order) => {
              const statusConfig = getOrderStatusConfig(order.status);
              return (
                <tr
                  key={order.orderId}
                  className="border-b border-orange-100 hover:bg-orange-50"
                >
                  <td className="py-3 px-4 text-gray-700 text-sm">
                    {order.orderNumber}
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-sm">
                    {formatShortVND(order.totalAmount)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}
                    >
                      {statusConfig.label}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

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
