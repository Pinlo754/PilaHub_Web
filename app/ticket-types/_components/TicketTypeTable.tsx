import { TicketType } from "@/utils/TicketType";
import TicketTypeRow from "./TicketTypeRow";

type Props = {
  items: TicketType[];
  startIndex: number;
  onPress: (item: TicketType) => void;
  onToggleActive: (item: TicketType) => void;
};

const TicketTypeTable = ({
  items,
  startIndex,
  onPress,
  onToggleActive,
}: Props) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-orange-100">
          <th className="text-center py-3 px-4 font-semibold text-orange-700 w-14">
            STT
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Tên loại đơn
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Mô tả
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Ngày tạo
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Trạng thái
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Hành động
          </th>
        </tr>
      </thead>
      <tbody>
        {items.length === 0 ? (
          <tr>
            <td colSpan={6} className="text-center py-10 text-gray-400">
              Không có loại đơn nào
            </td>
          </tr>
        ) : (
          items.map((item, idx) => (
            <TicketTypeRow
              key={item.ticketTypeId}
              item={item}
              index={startIndex + idx + 1}
              onPress={onPress}
              onToggleActive={onToggleActive}
            />
          ))
        )}
      </tbody>
    </table>
  );
};

export default TicketTypeTable;
