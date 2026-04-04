import { formatLocalDateTime } from "@/utils/day";
import { formatVND } from "@/utils/number";
import { OrderType } from "@/utils/OrderType";
import { getOrderStatusConfig } from "@/utils/uiMapper";

type Props = {
  order: OrderType;
  onPressOrder: (order: OrderType) => void;
  onPayout: (orderId: string) => void;
};

const OrderRow = ({ order, onPressOrder, onPayout }: Props) => {
  const statusConfig = getOrderStatusConfig(order.status);
  const canPayout = order.status === "COMPLETED" && !order.paidOut;

  return (
    <tr
      onClick={() => onPressOrder(order)}
      className="border-b border-orange-100 hover:bg-orange-50 cursor-pointer"
    >
      <td className="py-3 px-4 text-gray-700 text-sm font-mono">{order.orderNumber}</td>
      <td className="py-3 px-4 text-gray-700 text-sm">{order.recipientName}</td>
      <td className="py-3 px-4 text-gray-700 text-sm">{formatVND(order.totalAmount)}</td>
      <td className="py-3 px-4 text-sm">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            order.paid
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {order.paid ? "Đã thanh toán" : "Chưa thanh toán"}
        </span>
      </td>
      <td className="py-3 px-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}
        >
          {statusConfig.label}
        </span>
      </td>
      <td className="py-3 px-4 text-gray-700 text-sm">
        {formatLocalDateTime(order.createdAt)}
      </td>
      <td
        className="py-3 px-4"
        onClick={(e) => e.stopPropagation()} // chặn mở modal khi bấm nút
      >
        {canPayout && (
          <button
            onClick={() => onPayout(order.orderId)}
            className="px-3 py-1 bg-orange-500 text-white text-xs rounded-md hover:bg-orange-600 transition-colors whitespace-nowrap"
          >
            Trả tiền
          </button>
        )}
      </td>
    </tr>
  );
};

export default OrderRow;