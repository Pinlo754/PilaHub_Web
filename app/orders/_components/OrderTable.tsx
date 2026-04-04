import { OrderType } from "@/utils/OrderType";
import OrderRow from "./OrderRow";

type Props = {
  orders: OrderType[];
  onPressOrder: (order: OrderType) => void;
  onPayout: (orderId: string) => void;
};

const OrderTable = ({ orders, onPressOrder, onPayout }: Props) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-orange-100">
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Mã đơn
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Người nhận
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Tổng tiền
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Thanh toán
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Trạng thái
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Ngày tạo
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700"></th>
        </tr>
      </thead>
      <tbody>
        {orders.length === 0 ? (
          <tr>
            <td colSpan={7} className="py-10 text-center text-gray-400 text-sm">
              Không có đơn hàng
            </td>
          </tr>
        ) : (
          orders.map((order) => (
            <OrderRow
              key={order.orderId}
              order={order}
              onPressOrder={onPressOrder}
              onPayout={onPayout}
            />
          ))
        )}
      </tbody>
    </table>
  );
};

export default OrderTable;
