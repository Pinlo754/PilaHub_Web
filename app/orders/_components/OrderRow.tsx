import { formatLocalDateTime } from "@/utils/day";
import { formatVND } from "@/utils/number";
import { OrderType } from "@/utils/OrderType";
import { getOrderStatusConfig } from "@/utils/uiMapper";
import { Banknote, CheckCircle2, XCircle } from "lucide-react";

type Props = {
  order: OrderType;
  onPressOrder: (order: OrderType) => void;
  onPayout: (orderId: string, orderNumber: string) => void; // ← thêm orderNumber
  index: number;
};

const OrderRow = ({ order, onPressOrder, onPayout, index }: Props) => {
  const statusConfig = getOrderStatusConfig(order.status);
  const canPayout = order.status === "COMPLETED" && !order.paidOut;

  return (
    <tr
      onClick={() => onPressOrder(order)}
      className="border-b border-orange-100 hover:bg-orange-50 cursor-pointer"
    >
      <td className="py-3 px-3 text-center text-gray-400 text-sm">{index}</td>
      <td className="py-3 px-4 text-gray-700 text-sm font-mono">
        {order.orderNumber}
      </td>
      <td className="py-3 px-4 text-gray-700 text-sm">{order.recipientName}</td>
      <td className="py-3 px-4 text-gray-700 text-sm">
        {formatVND(order.totalAmount)}
      </td>
      <td className="py-1 px-4 text-center">
        <span title={order.paid ? "Đã thanh toán" : "Chưa thanh toán"}>
          {order.paid ? (
            <CheckCircle2 size={24} className="text-green-500 inline" />
          ) : (
            <XCircle size={24} className="text-red-500 inline" />
          )}
        </span>
      </td>
      <td className="py-3 px-4 text-center">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}
        >
          {statusConfig.label}
        </span>
      </td>
      <td className="py-3 px-4 text-gray-700 text-sm text-center">
        {formatLocalDateTime(order.createdAt)}
      </td>
      <td
        className="py-1 px-4 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() =>
            canPayout && onPayout(order.orderId, order.orderNumber)
          } // ← thêm orderNumber
          title={
            canPayout
              ? "Trả tiền nhà cung cấp"
              : order.paidOut
                ? "Đã trả tiền"
                : "Chưa đủ điều kiện trả tiền"
          }
          disabled={!canPayout}
          className={`py-1.5 px-2 rounded-md transition ${
            canPayout
              ? "text-orange-700 hover:text-orange-700 hover:bg-orange-200 bg-orange-100 cursor-pointer"
              : "text-gray-300 bg-gray-100 cursor-not-allowed"
          }`}
        >
          <Banknote size={20} />
        </button>
      </td>
    </tr>
  );
};

export default OrderRow;
