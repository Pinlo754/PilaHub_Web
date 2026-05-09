import { OrderType } from "@/utils/OrderType";
import OrderRow from "./OrderRow";

type Props = {
  orders: OrderType[];
  onPressOrder: (order: OrderType) => void;
  onPayout: (orderId: string, orderNumber: string) => void;
  pageOffset: number;
};

const OrderTable = ({ orders, onPressOrder, onPayout, pageOffset }: Props) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-orange-100">
          <th className="text-center py-3 px-3 font-semibold text-orange-700 w-12">
            STT
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Mã đơn
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Người nhận
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Tổng tiền
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Thanh toán
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Trạng thái
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Ngày tạo
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Hành động
          </th>
        </tr>
      </thead>
      <tbody>
        {orders.length === 0 ? (
          <tr>
            <td colSpan={8} className="py-10 text-center text-gray-400 text-sm">
              Không có đơn hàng
            </td>
          </tr>
        ) : (
          orders.map((order, index) => (
            <OrderRow
              key={order.orderId}
              order={order}
              onPressOrder={onPressOrder}
              onPayout={onPayout}
              index={pageOffset + index + 1}
            />
          ))
        )}
      </tbody>
    </table>
  );
};

export default OrderTable;
