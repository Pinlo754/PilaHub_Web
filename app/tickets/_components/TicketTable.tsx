import { TicketRes } from "@/utils/TicketType";
import { VendorType } from "@/utils/VendorType";
import TicketRow from "./TicketRow";

type Props = {
  items: TicketRes[];
  vendorMap: Record<string, VendorType>;
  startIndex: number;
  onPress: (item: TicketRes) => void;
  onApprove: (ticketId: string) => void;
  onReject: (ticketId: string) => void;
};

const TicketTable = ({
  items,
  vendorMap,
  startIndex,
  onPress,
  onApprove,
  onReject,
}: Props) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-orange-100">
          <th className="text-center py-3 px-4 font-semibold text-orange-700 w-14">
            STT
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Tiêu đề
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Loại đơn
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Người gửi
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
            <td colSpan={7} className="text-center py-10 text-gray-400">
              Không có đơn nào
            </td>
          </tr>
        ) : (
          items.map((item, idx) => (
            <TicketRow
              key={item.ticketId}
              item={item}
              vendor={vendorMap[item.accountId]}
              index={startIndex + idx + 1}
              onPress={onPress}
              onApprove={onApprove}
              onReject={onReject}
            />
          ))
        )}
      </tbody>
    </table>
  );
};

export default TicketTable;
