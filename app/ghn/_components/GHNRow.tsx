import { OrderType } from "@/utils/OrderType";
import { Truck } from "lucide-react";

type Props = {
  item: OrderType;
  index: number;
  onPress: (item: OrderType) => void;
  onMarkDelivered: (item: OrderType) => void;
};

const GHNRow = ({ item, index, onPress, onMarkDelivered }: Props) => {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("vi-VN");

  return (
    <tr
      onClick={() => onPress(item)}
      className="border-b border-orange-100 hover:bg-orange-50 cursor-pointer"
    >
      <td className="py-3 px-4 text-center text-gray-500 font-medium">
        {index}
      </td>

      <td className="py-3 px-4">
        <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
          {item.orderNumber}
        </span>
      </td>

      <td className="py-3 px-4 text-gray-700 font-medium">
        {item.recipientName}
      </td>

      <td className="py-3 px-4 text-gray-600">{item.recipientPhone}</td>

      <td
        className="py-3 px-4 text-gray-500 text-sm max-w-[200px] truncate"
        title={item.shippingAddress}
      >
        {item.shippingAddress}
      </td>

      <td className="py-3 px-4 text-right font-semibold text-orange-600">
        {item.totalAmount.toLocaleString("vi-VN")}đ
      </td>

      <td className="py-3 px-4 text-center">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.paid
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {item.paid ? "Đã thanh toán" : "Chưa thanh toán"}
        </span>
      </td>

      <td className="py-3 px-4 text-center text-gray-500 text-sm">
        {formatDate(item.createdAt)}
      </td>

      <td className="py-3 px-4 text-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMarkDelivered(item);
          }}
          title="Xác nhận đã giao"
          className="p-2 rounded-md inline-flex items-center justify-center bg-green-100 text-green-700 hover:bg-green-200 transition"
        >
          <Truck size={16} />
        </button>
      </td>
    </tr>
  );
};

export default GHNRow;
