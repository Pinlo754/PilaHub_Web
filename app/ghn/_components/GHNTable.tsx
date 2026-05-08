import { OrderType } from "@/utils/OrderType";
import GHNRow from "./GHNRow";

type Props = {
  items: OrderType[];
  startIndex: number;
  onPress: (item: OrderType) => void;
  onMarkDelivered: (item: OrderType) => void;
};

const GHNTable = ({ items, startIndex, onPress, onMarkDelivered }: Props) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-orange-100">
          <th className="text-center py-3 px-4 font-semibold text-orange-700 w-14">
            STT
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Mã đơn
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Khách hàng
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            SĐT
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Địa chỉ
          </th>
          <th className="text-right py-3 px-4 font-semibold text-orange-700">
            Tổng tiền
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Thanh toán
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Ngày đặt
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Hành động
          </th>
        </tr>
      </thead>
      <tbody>
        {items.length === 0 ? (
          <tr>
            <td colSpan={9} className="text-center py-10 text-gray-400">
              Không có đơn hàng nào
            </td>
          </tr>
        ) : (
          items.map((item, idx) => (
            <GHNRow
              key={item.orderId}
              item={item}
              index={startIndex + idx + 1}
              onPress={onPress}
              onMarkDelivered={onMarkDelivered}
            />
          ))
        )}
      </tbody>
    </table>
  );
};

export default GHNTable;
